
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalyzedTask {
  task: string;
  subject: string;
  focus_difficulty: number;
}

export interface SearchResult {
  answer: string;
  sources: { title: string; uri: string }[];
}

/**
 * Task categorization is considered a complex task due to reasoning requirements.
 * Using 'gemini-3-pro-preview' as per coding guidelines.
 */
export const categorizeTasks = async (todoText: string): Promise<AnalyzedTask[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this to-do list and categorize each item by subject and assign a focus difficulty (1-10): "${todoText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              subject: { type: Type.STRING },
              focus_difficulty: { type: Type.INTEGER },
            },
            required: ["task", "subject", "focus_difficulty"],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Task Analysis Error:", error);
    return [];
  }
};

/**
 * Information lookup with search grounding is handled with 'gemini-3-flash-preview'.
 */
export const performWebSearch = async (query: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const answer = response.text || "No information found.";
    const sources: { title: string; uri: string }[] = [];

    // Extract grounding chunks as required by the guidelines
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      });
    }

    // Filter unique sources
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);

    return { answer, sources: uniqueSources };
  } catch (error) {
    console.error("Web Search Error:", error);
    return { answer: "An error occurred while searching. Please try again.", sources: [] };
  }
};

export const getStudyNudge = async (patternSummary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a specialized Study Behavior Analyst. Analyze this study pattern: "${patternSummary}". Generate a personalized, motivational 'nudge' notification (max 25 words) suggesting an optimal study time or focus strategy for tomorrow. Output only the notification text.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "You're doing great! Try a morning session tomorrow for peak focus.";
  } catch (error) {
    console.error("Gemini Nudge Error:", error);
    return "Great progress today. Consistency is the key to mastery!";
  }
};

export const getStudyMotivation = async (subject: string, durationMinutes: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user has been studying ${subject} for ${durationMinutes} minutes. Give them a short, punchy, motivational one-liner to keep going or a smart study tip related to focus. Keep it under 20 words.`,
      config: {
        temperature: 0.8,
      },
    });
    return response.text || "Keep up the great work! You're making progress.";
  } catch (error) {
    console.error("Gemini Motivation Error:", error);
    return "The secret to getting ahead is getting started.";
  }
};

/**
 * High-level technical architecture insights require advanced reasoning.
 * Using 'gemini-3-pro-preview' as per coding guidelines for Complex Text Tasks.
 */
export const getArchitectureInsights = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "As a Senior Product Architect, provide a high-level technical breakdown for a real-time study app like Yeolpumta. Focus on how to scale WebSockets for 10,000 concurrent study sessions and how to structure a Redis leaderboard for global ranking. Return as a JSON object with sections for Stack, Scalability, and DatabaseSchema.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stack: { type: Type.STRING },
            scalability: { type: Type.STRING },
            databaseSchema: { type: Type.STRING },
          },
          required: ["stack", "scalability", "databaseSchema"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return null;
  }
};
