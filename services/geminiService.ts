import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ListResponse } from "../types";

// Initialize Gemini Client
// Requires process.env.API_KEY to be set
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchTop5List = async (townName: string, category: string, language: 'en' | 'mn'): Promise<ListResponse | null> => {
  try {
    const langInstruction = language === 'mn' 
      ? "OUTPUT LANGUAGE: Montenegrin (Crnogorski). Use local terminology." 
      : "OUTPUT LANGUAGE: English.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // Explicitly ask for 6 items to support the reserve logic
      contents: `Generate a curated list of exactly 6 items for the category "${category}" in ${townName}, Montenegro. The first 5 are the main list, the 6th is a hidden reserve item. ${langInstruction}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  location: { type: Type.STRING },
                  verificationStatus: { 
                    type: Type.STRING,
                    enum: ["verified", "needs_verification"]
                  },
                  imageKeyword: { type: Type.STRING }
                },
                required: ["name", "description", "reason", "verificationStatus", "imageKeyword"]
              }
            }
          },
          required: ["items"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ListResponse;
    }
    return null;
  } catch (error) {
    console.error("Content Generation Error:", error);
    throw error;
  }
};