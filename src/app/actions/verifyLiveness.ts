"use server";

import { getGeminiModel } from "@/lib/gemini/geminiClient";

export interface LivenessResult {
  is_real: boolean;
  confidence: number;
  anomalies: string[];
  reasoning: string;
}

export async function verifyLiveness(base64Image: string): Promise<LivenessResult> {
  try {
    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const prompt = "Analyze this image for liveness. Is this a real person or a deepfake/screen attack? Return JSON.";

    const result = await getGeminiModel().generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if Gemini returns them
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        const parsed: LivenessResult = JSON.parse(cleanText);
        return parsed;
    } catch (parseError) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Invalid response format from AI Forensic Auditor.");
    }

  } catch (error) {
    console.error("verifyLiveness error:", error);
    throw new Error("Liveness verification failed. Please try again.");
  }
}
