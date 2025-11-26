import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string suitable for Gemini API
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes the plant image using Gemini Flash 2.5
 */
export const analyzePlantImage = async (file: File): Promise<PlantAnalysis> => {
  const imagePart = await fileToGenerativePart(file);

  const prompt = `
    Act as an expert botanist and plant pathologist. Analyze the provided image.
    
    1. Determine if the image contains a plant or a leaf.
    2. If it is NOT a plant (e.g., a person, car, animal, random object), set "isPlant" to false.
    3. If it IS a plant, detect if it is healthy or has a disease/deficiency.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPlant: { type: Type.BOOLEAN },
            healthy: { type: Type.BOOLEAN },
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            description: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            organicTreatments: { type: Type.ARRAY, items: { type: Type.STRING } },
            chemicalTreatments: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "isPlant",
            "healthy",
            "diseaseName",
            "confidence",
            "description",
            "symptoms",
            "causes",
            "organicTreatments",
            "chemicalTreatments",
            "prevention"
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }
    
    const analysis: PlantAnalysis = JSON.parse(text);
    return analysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};