
export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

export const MOCK_API_DELAY = 1000; // ms

export const PLATFORMS = {
  TIKTOK: 'TikTok',
  INSTAGRAM: 'Instagram Reels',
  YOUTUBE: 'YouTube Shorts',
} as const;

// PlatformKey type is now in types.ts
export type PlatformValue = typeof PLATFORMS[keyof typeof PLATFORMS];
