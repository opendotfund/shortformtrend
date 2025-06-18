import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';
import { ContentIdea, DailyBriefing, GroundingChunk } from '../types';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

const parseJsonFromText = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original text:", text);
    // Try to recover if it's an array of objects missing the outer brackets
    try {
        const fixedJson = `[${jsonStr.split('\n').filter(line => line.trim().startsWith('{')).join(',')}]`;
        return JSON.parse(fixedJson) as T;
    } catch (fixError) {
        console.error("Failed to parse JSON with fix:", fixError);
        return null; // Return null if parsing fails
    }
  }
};

export const getDailyBriefing = async (): Promise<DailyBriefing> => {
  if (!API_KEY) return { greeting: "Hello Creator!", summary: "Gemini API key not configured. Daily briefing unavailable." };
  try {
    const prompt = `You are an AI assistant for short-form content creators.
    Provide a concise, engaging, and optimistic one-paragraph daily briefing.
    The briefing should summarize significant shifts, new emerging trends, or interesting observations in the short-form video landscape (TikTok, Instagram Reels, YouTube Shorts).
    Mention 2-3 specific examples of trends, sounds, or content styles.
    Keep it under 100 words. Start with a friendly greeting like "Good morning, Creator!" or "Hello Trendsetter!".
    Output a JSON object with two keys: "greeting" (string) and "summary" (string).
    Example: {"greeting": "Hey Digital Storyteller!", "summary": "Nostalgic gaming content is booming on Reels, while TikTok's latest dance challenge #GalaxyGlide is taking off. YouTube Shorts is seeing a rise in quick educational explainers on sustainable living. Time to get creative!"}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: [{ role: "user", parts: [{text: prompt}] }],
        config: {
          responseMimeType: "application/json",
        }
    });
    
    const responseText = response.text || "";
    const parsed = parseJsonFromText<DailyBriefing>(responseText);
    if (parsed) {
        return parsed;
    }
    return { greeting: "Hello!", summary: "Could not parse daily briefing from AI. The raw response was: " + responseText };

  } catch (error) {
    console.error("Error fetching daily briefing:", error);
    return { greeting: "Oops!", summary: "Could not fetch daily briefing due to an error. Please try again later."};
  }
};

export const getKeywordAnalysisSummary = async (
  keyword: string, 
  trendData?: string, 
  competitionData?: string, 
  relatedKeywords?: string[], 
  popularQuestions?: string[]
): Promise<string> => {
  if (!API_KEY) return "Gemini API key not configured. Analysis summary unavailable.";
  try {
    const prompt = `Analyze the keyword "${keyword}" for short-form content creation.
    Current trend data suggests: ${trendData || 'unavailable'}.
    Competition level is approximately: ${competitionData || 'unknown'}.
    Related keywords include: ${relatedKeywords?.join(', ') || 'none provided'}.
    Common questions people ask related to this topic are: ${popularQuestions?.join(', ') || 'none provided'}.

    Provide a concise (around 100-120 words) AI summary. This summary should:
    1. Highlight its current relevance and trajectory (e.g., peaking, emerging, declining).
    2. Identify the primary platform(s) where it is trending or has potential.
    3. Suggest one or two significant untapped niche angles or unique perspectives for content.
    4. Maintain an encouraging and insightful tone for content creators.

    Focus on actionable insights.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: [{ role: "user", parts: [{text: prompt}] }]
    });
    return response.text || "No response from AI.";
  } catch (error) {
    console.error("Error fetching keyword analysis summary:", error);
    return "Could not fetch AI summary due to an error.";
  }
};

export const generateContentIdeas = async (keyword: string, aiSummary: string): Promise<ContentIdea[]> => {
  if (!API_KEY) return [{ hook: "API Key Error", format: "Please configure Gemini API Key.", fullIdea: "Content ideas cannot be generated." }];
  try {
    const prompt = `You are a creative strategist for short-form video content.
    Based on the keyword "${keyword}" and the following AI-generated market summary:
    "${aiSummary}"

    Generate 3-5 specific, actionable, and creative short-form video ideas.
    Each idea MUST include:
    1. "hook": A compelling, short opening (max 15 words) to grab attention.
    2. "format": A suggested content format (e.g., Storytelling with reveal, Quick tutorial, Time-lapse/Process, Challenge, Myth-busting, Reaction, Duet, Educational explainer, Behind-the-scenes).
    3. "fullIdea" (optional but recommended): A brief elaboration of the concept (max 30 words).

    Output MUST be a valid JSON array of objects, where each object has "hook", "format", and optionally "fullIdea" string properties.
    Ensure the JSON is well-formed. Do not include any text outside the JSON array.

    Example JSON structure:
    [
      {"hook": "I asked AI to draw my childhood fear...", "format": "Storytelling with reveal", "fullIdea": "Show the prompt, the AI generation process, and your reaction to the final image."},
      {"hook": "3 prompts YOU NEED for amazing AI portraits!", "format": "Quick tutorial", "fullIdea": "Quickly demonstrate 3 effective prompts and the stunning results they produce."},
      {"hook": "Watch AI create a music video from lyrics.", "format": "Time-lapse/Process", "fullIdea": "Show lyrics, AI generating images for each line, and compile into a short music visualizer."}
    ]`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: [{ role: "user", parts: [{text: prompt}] }],
        config: {
            responseMimeType: "application/json",
        }
    });

    const responseText = response.text || "";
    const parsedIdeas = parseJsonFromText<ContentIdea[]>(responseText);

    if (parsedIdeas && Array.isArray(parsedIdeas)) {
        return parsedIdeas;
    } else {
        console.warn("Could not parse content ideas as JSON array. Raw response:", responseText);
        // Fallback: try to extract some ideas if parsing failed but text exists
        if(responseText.includes("hook") && responseText.includes("format")) {
            return [{ hook: "AI couldn't format ideas perfectly.", format: "Check raw output below.", fullIdea: responseText.substring(0, 200) + "..." }];
        }
        return [{ hook: "Error", format: "Failed to generate ideas or parse response.", fullIdea: "Please try again." }];
    }
  } catch (error) {
    console.error("Error generating content ideas:", error);
    return [{ hook: "API Error", format: "Could not connect to AI.", fullIdea: "Please check your connection or API key and try again." }];
  }
};

export const getGroundedAnswer = async (query: string): Promise<{answer: string, sources: GroundingChunk[]}> => {
  if (!API_KEY) return { answer: "Gemini API key not configured. Grounded search unavailable.", sources: [] };
  try {
    const response = await ai.models.generateContent({
       model: GEMINI_TEXT_MODEL,
       contents: [{ role: "user", parts: [{text: query}] }],
       config: {
         tools: [{googleSearch: {}}],
       },
    });

    const answer = response.text || "No response from AI.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(chunk => chunk.web) || [];
    
    return { answer, sources };

  } catch (error) {
    console.error("Error fetching grounded answer:", error);
    const err = error as any;
    if (err.message && err.message.includes("does not support tools")) {
         return { answer: `The current model (${GEMINI_TEXT_MODEL}) might not fully support Google Search grounding or there was a configuration issue. Error: ${err.message}`, sources: [] };
    }
    return { answer: "Could not fetch grounded answer due to an error.", sources: [] };
  }
};
