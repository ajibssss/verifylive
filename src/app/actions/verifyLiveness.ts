"use server";

import { getGeminiModel } from "@/lib/gemini/geminiClient";

export interface LivenessResult {
  is_real: boolean;
  confidence: number;
  anomalies: string[];
  reasoning: string;
}

export async function verifyLiveness(frames: string[]): Promise<LivenessResult> {
  try {
    const prompt = `
    Analyze this sequence of 5 video frames for liveness. 
    The user was asked to perform the following challenges in order:
    1. Neutral Face
    2. Turn Right (3D check)
    3. Smile/Expression (Muscle check)
    4. Zoom In (Depth check)
    5. Hold ID/Hand (Possession/Occlusion check)

    FORENSIC ANALYSIS REQUIRED:
    - **Consistency**: Do features remain consistent across angles/lighting?
    - **3D Structure**: Does the face rotate naturally or warp like a 2D texture?
    - **Micro-expressions**: Are eye movements and muscle flexes natural?
    - **Artifacts**: Look for screen moire, edge blurring, or glitching.

    Return JSON with:
    - is_real: boolean
    - confidence: number (0-100)
    - anomalies: string[] (list suspicious elements)
    - reasoning: string (brief explanation of the verdict)
    `;

    // Prepare inputs for Gemini (Prompt + 5 Images)
    const inputs: (string | { inlineData: { data: string; mimeType: string } })[] = [prompt];
    
    frames.forEach((frameBase64) => {
        const cleanData = frameBase64.replace(/^data:image\/\w+;base64,/, "");
        inputs.push({
            inlineData: {
                data: cleanData,
                mimeType: "image/jpeg",
            },
        });
    });

    const result = await getGeminiModel().generateContent(inputs);

    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if Gemini returns them
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        const parsed: LivenessResult = JSON.parse(cleanText);
        return parsed;
    } catch (parseError) {
        console.error("Failed to parse Gemini response:", text, parseError);
        throw new Error("Invalid response format from AI Forensic Auditor.");
    }

  } catch (error) {
    console.error("verifyLiveness error:", error);
    throw new Error("Liveness verification failed. Please try again.");
  }
}
