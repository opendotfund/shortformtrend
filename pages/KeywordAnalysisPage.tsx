
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKeywordAnalysis } from '../services/mockTrendsDataService';
import { getKeywordAnalysisSummary, generateContentIdeas as fetchContentIdeas } from '../services/geminiService';
import { KeywordAnalysisData, ContentIdea, Point, PlatformKey, PLATFORM_KEYS } from '../types'; // Correctly import PlatformKey and PLATFORM_KEYS
import { PLATFORMS } from '../constants';
import Card from '../components/Card';
import LineGraph from '../components/LineGraph';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import Button from '../components/Button';

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.354a7.5 7.5 0 0 1-4.5 0m4.5 0v-.375c0-.621-.504-1.125-1.125-1.125H12a1.125 1.125 0 0 1-1.125-1.125V6.75m3.75 9.75H12a2.25 2.25 0 0 0-2.25 2.25m4.5 0a2.25 2.25 0 0 1-2.25 2.25M12 6.75V6A2.25 2.25 0 0 0 9.75 3.75h-.375c-.621 0-1.125.504-1.125 1.125v1.5A2.25 2.25 0 0 0 9.75 8.25h.375m3.75-1.5a2.25 2.25 0 0 0-2.25-2.25M12 6.75V3.75m0 3h.008v.008H12V6.75Zm-3.75 0h.008v.008H8.25V6.75Zm0 9.75h.008v.008H8.25v-.008Zm0 0H12m3.75 0h.008v.008H15.75v-.008Zm0 0H12M9.75 12a2.25 2.25 0 0 0-2.25 2.25M12 12a2.25 2.25 0 0 1 2.25 2.25m0 0a2.25 2.25 0 0 0 2.25 2.25M12 12a2.25 2.25 0 0 0-2.25-2.25m2.25-1.5V6" />
</svg>
);


type TrendViewOption = '7day' | '30day' | '90day';

const KeywordAnalysisPage: React.FC<{ keyword: string }> = ({ keyword }) => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<KeywordAnalysisData | null>(null);
  const [geminiSummary, setGeminiSummary] = useState<string | null>(null);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIdeasLoading, setIsIdeasLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrendView, setCurrentTrendView] = useState<TrendViewOption>('30day');
  const [activePlatformTab, setActivePlatformTab] = useState<PlatformKey>('TIKTOK');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mockData = await getKeywordAnalysis(keyword);
      setAnalysisData(mockData);

      // Fetch AI summary from Gemini using mock data as context
      const summary = await getKeywordAnalysisSummary(
        keyword,
        `Trend score: ${mockData.trendScore}/100, trajectory indicates moderate interest.`, // Simplified trend data for summary
        mockData.competitionLevel,
        mockData.audienceInsights.relatedKeywords.slice(0,3),
        mockData.audienceInsights.questionRadar.slice(0,2)
      );
      setGeminiSummary(summary);
      // Pre-populate with mock ideas, will be replaced by Gemini generated ones if button clicked
      setContentIdeas(mockData.contentIdeas); 

    } catch (err) {
      console.error("Error fetching keyword analysis:", err);
      setError(`Failed to load analysis for "${keyword}". Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]); 

  const handleGenerateIdeas = async () => {
    if (!analysisData || !geminiSummary) return;
    setIsIdeasLoading(true);
    try {
      const ideas = await fetchContentIdeas(keyword, geminiSummary);
      setContentIdeas(ideas);
    } catch (err) {
      console.error("Error generating content ideas:", err);
      setContentIdeas([{ hook: "Error", format: "Could not generate ideas. Please try again." }]);
    } finally {
      setIsIdeasLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={`Analyzing "${keyword}"...`} />;
  }

  if (error || !analysisData) {
    return (
        <div className="text-center">
            <ErrorDisplay title="Analysis Error" message={error || "Keyword data not found."} />
            <Button onClick={() => navigate('/')} variant="secondary" className="mt-6">
                <ArrowLeftIcon className="h-5 w-5 mr-2" /> Go to Dashboard
            </Button>
        </div>
    );
  }

  const currentPlatformData = analysisData.platformInsights[activePlatformTab.toLowerCase() as keyof KeywordAnalysisData['platformInsights']];

  const trendDataForView = analysisData.trendTrajectory[currentTrendView] || [];

  return (
    <div className="space-y-8">
      <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-6 text-sky-400 hover:text-sky-300">
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Dashboard
      </Button>

      <section>
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Keyword Analysis: <span className="text-sky-500">{analysisData.keyword}</span></h1>
        <div className="flex items-center space-x-4 text-sm text-slate-400 mb-6">
          <span>Trend Score: <strong className="text-sky-400">{analysisData.trendScore}/100</strong></span>
          <span>Competition: <strong className="text-yellow-400">{analysisData.competitionLevel}</strong></span>
        </div>
      </section>

      <Card title="AI-Powered Summary & Insights" className="bg-gradient-to-r from-slate-800 to-slate-850">
        {geminiSummary ? (
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{geminiSummary}</p>
        ) : (
          <LoadingSpinner text="Generating AI summary..." size="sm" />
        )}
      </Card>
      
      <Card title="Trend Trajectory">
        <div className="mb-4 flex space-x-2">
            {(['7day', '30day', '90day'] as TrendViewOption[]).map(view => (
                <Button 
                    key={view} 
                    variant={currentTrendView === view ? 'primary' : 'secondary'} 
                    size="sm"
                    onClick={() => setCurrentTrendView(view)}
                >
                    {view}
                </Button>
            ))}
        </div>
        <LineGraph data={trendDataForView} title={`Interest Over Last ${currentTrendView}`} />
      </Card>

      <Card title="Platform Breakdown">
        <div className="border-b border-slate-700 mb-4">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {PLATFORM_KEYS.map((platformKey) => (
              <button
                key={platformKey}
                onClick={() => setActivePlatformTab(platformKey)}
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm
                  ${activePlatformTab === platformKey 
                    ? 'border-sky-500 text-sky-500' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}
              >
                {PLATFORMS[platformKey]}
              </button>
            ))}
          </nav>
        </div>
        {currentPlatformData && (
          <div className="space-y-3">
            {currentPlatformData.score && <p className="text-sm text-slate-400">Platform Relevance Score: <span className="font-bold text-sky-400">{currentPlatformData.score}/100</span></p>}
            <h4 className="font-semibold text-slate-200">Nuances:</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1 text-sm">
              {currentPlatformData.nuances.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
            {currentPlatformData.trendingSounds && currentPlatformData.trendingSounds.length > 0 && (
              <>
                <h4 className="font-semibold text-slate-200 mt-2">Trending Sounds/Audio:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentPlatformData.trendingSounds.map((s, i) => <span key={i} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-sky-300">{s}</span>)}
                </div>
              </>
            )}
             {currentPlatformData.popularEffects && currentPlatformData.popularEffects.length > 0 && (
              <>
                <h4 className="font-semibold text-slate-200 mt-2">Popular Effects:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentPlatformData.popularEffects.map((s, i) => <span key={i} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-teal-300">{s}</span>)}
                </div>
              </>
            )}
            {currentPlatformData.visualAesthetics && currentPlatformData.visualAesthetics.length > 0 && (
              <>
                <h4 className="font-semibold text-slate-200 mt-2">Visual Aesthetics:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentPlatformData.visualAesthetics.map((s, i) => <span key={i} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-indigo-300">{s}</span>)}
                </div>
              </>
            )}
            {currentPlatformData.commonFormats && currentPlatformData.commonFormats.length > 0 && (
              <>
                <h4 className="font-semibold text-slate-200 mt-2">Common Formats:</h4>
                 <div className="flex flex-wrap gap-2">
                  {currentPlatformData.commonFormats.map((f, i) => <span key={i} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-slate-300">{f}</span>)}
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      <Card title="Content Idea Generator" actions={
        <Button onClick={handleGenerateIdeas} isLoading={isIdeasLoading} variant="primary" size="sm">
            <LightBulbIcon className="h-5 w-5 mr-2"/>
            {contentIdeas.length > 0 && contentIdeas[0].hook !== "Error" && contentIdeas[0].hook !== "API Key Error" ? 'Regenerate Ideas' : 'Give Me Ideas'}
        </Button>
      }>
        {isIdeasLoading && contentIdeas.length === 0 && <LoadingSpinner text="Generating fresh ideas..." size="sm"/>}
        {contentIdeas.length > 0 ? (
          <div className="space-y-4">
            {contentIdeas.map((idea, index) => (
              <div key={index} className="bg-slate-700 p-4 rounded-md shadow">
                <p className="font-semibold text-sky-400">Hook: <span className="text-slate-200">{idea.hook}</span></p>
                <p className="text-sm text-slate-300">Format: <span className="font-medium text-slate-100">{idea.format}</span></p>
                {idea.fullIdea && <p className="text-xs text-slate-400 mt-1">Concept: {idea.fullIdea}</p>}
              </div>
            ))}
          </div>
        ) : (
          !isIdeasLoading && <p className="text-slate-400">Click "Give Me Ideas" to generate AI-powered content concepts!</p>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Audience & Niche Insights">
            <div className="space-y-3">
                <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Related Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysisData.audienceInsights.relatedKeywords.map(kw => <span key={kw} className="bg-slate-700 px-2 py-0.5 rounded text-xs text-slate-300">{kw}</span>)}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Emerging Niches:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-0.5 pl-1">
                        {analysisData.audienceInsights.emergingNiches.map(niche => <li key={niche}>{niche}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Question Radar (What people are asking):</h4>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-0.5 pl-1">
                        {analysisData.audienceInsights.questionRadar.map(q => <li key={q}>{q}</li>)}
                    </ul>
                </div>
            </div>
        </Card>
        <Card title="Top Performing Content Examples">
            {analysisData.topPerformingContent.length > 0 ? (
            <div className="space-y-4">
                {analysisData.topPerformingContent.slice(0,3).map(content => ( // Show 3 examples
                <div key={content.id} className="flex items-center space-x-3">
                    <img src={content.thumbnailUrl} alt={content.title} className="w-20 h-12 object-cover rounded"/>
                    <div>
                        <p className="text-sm font-medium text-slate-200 leading-tight">{content.title}</p>
                        <p className="text-xs text-slate-400">{PLATFORMS[content.platform.toUpperCase().replace(' REELS','').replace(' SHORTS','').replace(' ','') as PlatformKey] || content.platform} {content.creator && `by ${content.creator}`}</p>
                    </div>
                </div>
                ))}
            </div>
            ) : (
                <p className="text-slate-400">No specific top performing content examples available for this keyword.</p>
            )}
        </Card>
      </div>
    </div>
  );
};

export default KeywordAnalysisPage;
