
import { TrendItem, NicheOpportunityItem, KeywordAnalysisData, Point, PlatformInsights, AudienceInsights, TopContentExample, ContentIdea } from '../types';
import { MOCK_API_DELAY, PLATFORMS } from '../constants';

const generateRandomGraphData = (days: number, peakiness: number = 0.7, startValue: number = 10): Point[] => {
  const data: Point[] = [];
  let currentValue = startValue;
  for (let i = days; i >= 1; i--) {
    data.push({ name: `Day ${days - i + 1}`, value: Math.max(0, Math.round(currentValue)) });
    const change = (Math.random() - (0.5 - peakiness * 0.2)) * 20; // More positive for upward
    currentValue += change;
    if (currentValue < 5) currentValue = 5 + Math.random() * 5; // Ensure not too low
    if (currentValue > 95 && Math.random() < 0.3) currentValue -= Math.random() * 10; // Occasional dip from peak
  }
  return data.reverse(); // Ensure chronological order for graph
};

const mockTrendItems: TrendItem[] = [
  { id: '1', name: "ASMR Unboxing", graphData: generateRandomGraphData(7, 0.8, 40), competition: 'Medium', platform: 'General' },
  { id: '2', name: "Vintage Tech Revival", graphData: generateRandomGraphData(7, 0.7, 20), competition: 'Low', platform: 'Instagram' },
  { id: '3', name: "#BakingFails Challenge", graphData: generateRandomGraphData(7, 0.9, 60), competition: 'Hard', platform: 'TikTok' },
  { id: '4', name: "AI News Explainers (1-min)", graphData: generateRandomGraphData(7, 0.6, 30), competition: 'Medium', platform: 'YouTube Shorts' },
  { id: '5', name: "Sustainable Living Tips", graphData: generateRandomGraphData(7, 0.5, 25), competition: 'Medium', platform: 'General' },
];

const mockNicheOpportunities: NicheOpportunityItem[] = [
  { id: 'n1', name: "AI for Local Businesses", searchInterest: 'High', competition: 'Low', description: "Tutorials on using AI tools to boost small local businesses." },
  { id: 'n2', name: "Ethical AI Art Discussions", searchInterest: 'Medium', competition: 'Low', description: "Exploring the moral implications and future of AI in art." },
  { id: 'n3', name: "DIY Smart Home Gadgets", searchInterest: 'High', competition: 'Medium', description: "Creating and showcasing custom smart home solutions on a budget." },
  { id: 'n4', name: "Beginner Coding on Mobile", searchInterest: 'Medium', competition: 'Low', description: "Teaching basic coding concepts using mobile-only apps/tools." },
];

const mockPlatformInsights = (keyword: string): PlatformInsights => ({
  tiktok: {
    score: Math.floor(Math.random() * 30 + 70), // 70-99
    nuances: [`"${keyword}" is huge on TikTok, especially with trending sound X.`, "Focus on quick cuts and engaging captions.", "User-generated content performs well."],
    trendingSounds: ["ViralSound123", "UpbeatTrackABC"],
    popularEffects: ["GreenScreenDeluxe", "CloneTrail"],
    commonFormats: ["Challenge participation", "Before & After", "Storytime lip-sync"]
  },
  instagram: {
    score: Math.floor(Math.random() * 30 + 65), // 65-94
    nuances: [`Aesthetic visuals are key for "${keyword}" on Instagram Reels.`, "Collaborations with other creators can boost visibility.", "Use relevant hashtags strategically."],
    visualAesthetics: ["Cinematic LUTs", "Minimalist Clean", "Retro VHS"],
    trendingSounds: ["ReelsTrendingAudio", "ChillVibesOnly"],
    commonFormats: ["Tutorials/How-tos", "Product showcases", "Inspirational montages"]
  },
  youtube: {
    score: Math.floor(Math.random() * 30 + 60), // 60-89
    nuances: [`Searchability is crucial for "${keyword}" on YouTube Shorts.`, "Longer-form content tie-ins can work.", "Clear value proposition in the first 3 seconds."],
    trendingSounds: ["Shorts Library Hit", "NCS Remix"], // Changed from popularMusic to trendingSounds
    commonFormats: ["Quick tips", "Myth busting", "Mini-documentaries"]
  }
});

const mockAudienceInsights = (keyword: string): AudienceInsights => ({
  relatedKeywords: [`${keyword} tutorial`, `best ${keyword} tools`, `${keyword} fails`, `${keyword} 2024`, `how to ${keyword}`],
  emergingNiches: [`${keyword} for beginners`, `advanced ${keyword} techniques`, `ethical ${keyword}`, `${keyword} in education`, `AI ${keyword}`],
  questionRadar: [`Is ${keyword} hard to learn?`, `How much does ${keyword} cost?`, `What is the future of ${keyword}?`, `Can I make money with ${keyword}?`]
});

const mockTopPerformingContent = (keyword: string): TopContentExample[] => ([
  { id:'tp1', title: `My CRAZY ${keyword} Journey!`, thumbnailUrl: `https://via.placeholder.com/300x180.png?text=${encodeURIComponent(keyword)}+Example+1`, platform: 'TikTok', creator: 'CreatorMax' },
  { id:'tp2', title: `The ULTIMATE ${keyword} Hack You NEED!`, thumbnailUrl: `https://via.placeholder.com/300x180.png?text=${encodeURIComponent(keyword)}+Example+2`, platform: 'YouTube Shorts', creator: 'TechGuru' },
  { id:'tp3', title: `Aesthetic ${keyword} Day in My Life`, thumbnailUrl: `https://via.placeholder.com/300x180.png?text=${encodeURIComponent(keyword)}+Example+3`, platform: 'Instagram', creator: 'StyleByAI' },
  { id:'tp4', title: `Trying ${keyword} for the First Time (EPIC FAIL!)`, thumbnailUrl: `https://via.placeholder.com/300x180.png?text=${encodeURIComponent(keyword)}+Example+4`, platform: 'TikTok', creator: 'NoobPlays' },
]);


export const getTopTrendingNow = (): Promise<TrendItem[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockTrendItems.slice(0, Math.floor(Math.random() * 3) + 3)), MOCK_API_DELAY / 2); // 3 to 5 items
  });
};

export const getNicheOpportunities = (): Promise<NicheOpportunityItem[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockNicheOpportunities.slice(0, Math.floor(Math.random() * 2) + 2)), MOCK_API_DELAY / 2); // 2 to 3 items
  });
};

export const getKeywordAnalysis = (keyword: string): Promise<KeywordAnalysisData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const competitionLevels: ('Easy' | 'Medium' | 'Hard' | 'Very Hard')[] = ['Easy', 'Medium', 'Hard', 'Very Hard'];
      const randomCompetition = competitionLevels[Math.floor(Math.random() * competitionLevels.length)];
      
      const analysis: KeywordAnalysisData = {
        keyword: keyword,
        trendScore: Math.floor(Math.random() * 50 + 50), // 50-99
        competitionLevel: randomCompetition,
        aiSummary: `Mock AI Summary for "${keyword}": This topic is currently buzzing, especially on TikTok. While general showcases are common, there's a niche in ${keyword} for educational purposes or comedic takes. Competition is ${randomCompetition.toLowerCase()}.`,
        trendTrajectory: {
          '7day': generateRandomGraphData(7, 0.7, Math.random()*30+20),
          '30day': generateRandomGraphData(30, 0.6, Math.random()*20+10),
          '90day': generateRandomGraphData(90, 0.5, Math.random()*10+5),
        },
        platformInsights: mockPlatformInsights(keyword),
        contentIdeas: [ 
          { hook: `Can YOU guess this ${keyword} sound?`, format: "Interactive Quiz"},
          { hook: `My top 3 ${keyword} secrets REVEALED!`, format: "Quick Tips", fullIdea: "Share valuable insights quickly." },
          { hook: `Transforming X to Y with ${keyword}!`, format: "Transformation Time-lapse", fullIdea: "Show a cool before/after process." }
        ],
        audienceInsights: mockAudienceInsights(keyword),
        topPerformingContent: mockTopPerformingContent(keyword),
      };
      resolve(analysis);
    }, MOCK_API_DELAY);
  });
};
