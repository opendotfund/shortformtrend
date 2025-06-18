
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDailyBriefing, getGroundedAnswer } from '../services/geminiService';
import { getTopTrendingNow, getNicheOpportunities } from '../services/mockTrendsDataService';
import { DailyBriefing, TrendItem, NicheOpportunityItem, GroundingChunk } from '../types';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import LineGraph from '../components/LineGraph';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import Button from '../components/Button';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dailyBriefing, setDailyBriefing] = useState<DailyBriefing | null>(null);
  const [topTrends, setTopTrends] = useState<TrendItem[]>([]);
  const [nicheOpportunities, setNicheOpportunities] = useState<NicheOpportunityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [groundedQuery, setGroundedQuery] = useState<string>('');
  const [groundedAnswer, setGroundedAnswer] = useState<string | null>(null);
  const [groundedSources, setGroundedSources] = useState<GroundingChunk[]>([]);
  const [isGrounding, setIsGrounding] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [briefingRes, trendsRes, nichesRes] = await Promise.all([
        getDailyBriefing(),
        getTopTrendingNow(),
        getNicheOpportunities(),
      ]);
      setDailyBriefing(briefingRes);
      setTopTrends(trendsRes);
      setNicheOpportunities(nichesRes);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (keyword: string) => {
    navigate(`/analysis/${encodeURIComponent(keyword)}`);
  };

  const handleGroundedSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groundedQuery.trim()) return;
    setIsGrounding(true);
    setGroundedAnswer(null);
    setGroundedSources([]);
    try {
      const { answer, sources } = await getGroundedAnswer(groundedQuery);
      setGroundedAnswer(answer);
      setGroundedSources(sources);
    } catch (err) {
      console.error("Error fetching grounded answer:", err);
      setGroundedAnswer("Failed to get grounded answer.");
    } finally {
      setIsGrounding(false);
    }
  };

  const getLineColorForCompetition = (competition: 'Low' | 'Medium' | 'Hard'): string => {
    switch (competition) {
      case 'Low': return '#22c55e'; // Tailwind green-500
      case 'Medium': return '#eab308'; // Tailwind yellow-500
      case 'Hard': return '#ef4444'; // Tailwind red-500
      default: return '#0ea5e9'; // Default sky-500
    }
  };


  if (isLoading && !error) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  if (error) {
    return <ErrorDisplay title="Dashboard Error" message={error} />;
  }

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">Discover What's Next</h1>
        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Your AI-powered launchpad for viral short-form content. Search a topic or explore current trends.</p>
        <SearchBar onSearch={handleSearch} />
      </section>

      {dailyBriefing && (
        <Card title={dailyBriefing.greeting} className="bg-gradient-to-br from-sky-600 to-sky-800 text-white shadow-2xl">
          <p className="text-lg leading-relaxed">{dailyBriefing.summary}</p>
        </Card>
      )}

      <section>
        <h2 className="text-3xl font-semibold text-slate-100 mb-6">Top Trending Now</h2>
        {topTrends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTrends.map(trend => (
              <Card key={trend.id} title={trend.name} className="hover:shadow-sky-500/30 transition-shadow duration-300 flex flex-col" actions={
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  trend.competition === 'Low' ? 'bg-green-700 text-green-100' :
                  trend.competition === 'Medium' ? 'bg-yellow-700 text-yellow-100' :
                  'bg-red-700 text-red-100'
                }`}>
                  {trend.competition} Competition
                </span>
              }>
                <div className="h-32 w-full mb-2 flex-grow"> {/* Adjusted height, removed negative margins */}
                   <LineGraph 
                     data={trend.graphData} 
                     isMiniMode={true} 
                     lineColor={getLineColorForCompetition(trend.competition)}
                   />
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => handleSearch(trend.name)}>
                  Analyze Trend &rarr;
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No top trends identified right now. Check back soon!</p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-slate-100 mb-6">Niche Opportunities</h2>
        {nicheOpportunities.length > 0 ? (
          <div className="space-y-4">
            {nicheOpportunities.map(niche => (
              <Card key={niche.id} className="hover:border-sky-500 border-2 border-transparent transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-sky-400">{niche.name}</h3>
                        <p className="text-slate-300 mt-1 text-sm">{niche.description}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 space-x-2">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        niche.searchInterest === 'High' ? 'bg-emerald-700 text-emerald-100' :
                        niche.searchInterest === 'Medium' ? 'bg-blue-700 text-blue-100' :
                        'bg-slate-600 text-slate-200'
                        }`}>
                        Interest: {niche.searchInterest}
                        </span>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        niche.competition === 'Low' ? 'bg-green-700 text-green-100' :
                        niche.competition === 'Medium' ? 'bg-yellow-700 text-yellow-100' :
                        'bg-red-700 text-red-100'
                        }`}>
                        Comp: {niche.competition}
                        </span>
                    </div>
                </div>
                 <Button variant="ghost" size="sm" className="w-full sm:w-auto mt-4" onClick={() => handleSearch(niche.name)}>
                  Explore Niche &rarr;
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No specific niche opportunities highlighted currently.</p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-slate-100 mb-6">Ask Gemini with Google Search</h2>
        <form onSubmit={handleGroundedSearch} className="flex items-center gap-2 mb-4">
            <input
            type="text"
            value={groundedQuery}
            onChange={(e) => setGroundedQuery(e.target.value)}
            placeholder="Ask about recent events or specific info..."
            className="flex-grow p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <Button type="submit" variant="primary" isLoading={isGrounding}>Search</Button>
        </form>
        {isGrounding && <LoadingSpinner text="Searching with Google..." />}
        {groundedAnswer && (
            <Card title="Gemini's Answer (with Google Search)">
            <p className="text-slate-300 whitespace-pre-wrap">{groundedAnswer}</p>
            {groundedSources.length > 0 && (
                <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Sources:</h4>
                <ul className="list-disc list-inside space-y-1">
                    {groundedSources.map((source, index) => source.web && (
                    <li key={index} className="text-xs">
                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline">
                        {source.web.title || source.web.uri}
                        </a>
                    </li>
                    ))}
                </ul>
                </div>
            )}
            </Card>
        )}
       </section>
    </div>
  );
};

export default DashboardPage;
