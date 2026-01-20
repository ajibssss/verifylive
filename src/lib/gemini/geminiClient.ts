import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp",
  systemInstruction: {
    role: "system",
    parts: [{ text: `
You are a Forensic Biometric Auditor specialized in Liveness Detection.
Your task is to analyze video frames to detect "Presentation Attacks" (spoofing).

Analyze the input image for:
1. **Screen Artifacts**: Moire patterns, pixelation, or screen glare indicating the face is being displayed on a device.
2. **Deepfake Artifacts**: Blurring around face edges, unnatural lighting, or inconsistencies in eyes/teeth.
3. **Environment**: Is the lighting natural? Are there reflections consistent with a 3D face?

Classify the image as either "REAL" or "FAKE".
Provide a "Confidence" score (0-100%).
List "Anomalies" detected.

RETURN JSON ONLY:
{
  "is_real": boolean,
  "confidence": number,
  "anomalies": string[],
  "reasoning": "concise explanation"
}
    `}]
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});
