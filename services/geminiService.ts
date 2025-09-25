
import { GoogleGenAI, Type } from "@google/genai";
import type { ProcessedMonthlyData, Insight } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const insightSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A concise, engaging title for the financial insight (e.g., 'Strong Asset Growth', 'Liability Reduction')."
        },
        explanation: {
            type: Type.STRING,
            description: "A clear, data-driven explanation of the observation. Mention specific numbers or trends from the data. For example, 'Your net worth grew by 15% over the last quarter, primarily driven by your mutual fund performance.'"
        },
        suggestion: {
            type: Type.STRING,
            description: "An actionable suggestion or recommendation based on the insight. For example, 'Consider diversifying your stock portfolio to mitigate risk' or 'Great job paying down your liabilities. Keep up the momentum.'"
        }
    },
    required: ["title", "explanation", "suggestion"]
};

export const generateFinancialInsights = async (data: ProcessedMonthlyData[]): Promise<Insight[] | null> => {
  try {
    const prompt = `Analyze the following personal financial data and provide three distinct, actionable insights. For each insight, provide a title, a data-driven explanation, and a practical suggestion. The data represents monthly snapshots of assets and liabilities.
    
    Data:
    ${JSON.stringify(data, null, 2)}
    
    Focus on trends in net worth, asset allocation, liability changes, and overall financial health. Provide concrete advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: insightSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.error("Gemini API returned an empty response.");
        return null;
    }

    const insights: Insight[] = JSON.parse(jsonText);
    return insights;

  } catch (error) {
    console.error("Error generating financial insights:", error);
    return null;
  }
};
