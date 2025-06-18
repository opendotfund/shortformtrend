export interface Point {
  name: string; // For XAxis dataKey
  value: number; // For Line dataKey
}

export interface TrendItem {
  id: string;
  name: string;
  graphData: Point[];
  competition: 'Low' | 'Medium' | 'Hard';
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'General';
}

export interface NicheOpportunityItem {
  id: string;
  name: string;
  searchInterest: 'High' | 'Medium' | 'Low';
  competition: 'Low' | 'Medium' | 'Hard';
  description: string;
}

export interface PlatformDetail {
  score?: number; // Optional as not all platforms might have a score
  nuances: string[];
  trendingSounds?: string[];
  popularEffects?: string[];
  commonFormats?: string[];
  visualAesthetics?: string[];
}

export interface PlatformInsights {
  tiktok: PlatformDetail;
  instagram: PlatformDetail;
  youtube: PlatformDetail;
}

export interface ContentIdea {
  hook: string;
  format: string;
  fullIdea?: string; 
}

export interface AudienceInsights {
  relatedKeywords: string[];
  emergingNiches: string[];
  questionRadar: string[];
}

export interface TopContentExample {
  id: string;
  title: string;
  thumbnailUrl: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts';
  creator?: string; // Optional
}

export interface KeywordAnalysisData {
  keyword: string;
  trendScore: number; // 0-100
  competitionLevel: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  aiSummary: string;
  trendTrajectory: {
    '7day': Point[];
    '30day': Point[];
    '90day': Point[];
  };
  platformInsights: PlatformInsights;
  contentIdeas: ContentIdea[];
  audienceInsights: AudienceInsights;
  topPerformingContent: TopContentExample[];
}

export interface DailyBriefing {
  greeting: string;
  summary: string;
}

export interface GroundingChunkWeb {
  uri?: string;
  title?: string;
}
export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks can be added here if needed
}

// Moved from constants.ts as it's a type definition
export const PLATFORM_KEYS = ['TIKTOK', 'INSTAGRAM', 'YOUTUBE'] as const;
export type PlatformKey = typeof PLATFORM_KEYS[number];
