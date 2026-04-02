import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ScientificRiskReport {
  carcinogens: {
    name: string;
    iarcGroup: '1' | '2A' | '2B' | '3';
    linkedOncology: string[];
    evaluationYear: number;
    monographRef: string;
    exposureRoutes: string[];
    evidenceStrength: string;
    safeLimits?: string;
  }[];
  overallRisk: 'Safe' | 'Caution' | 'High Risk';
  assessment: string;
  recommendations: string[];
}

export async function analyzeProduct(input: string, type: 'text' | 'barcode' | 'image', language: string, imageData?: string): Promise<ScientificRiskReport> {
  if (!API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY_MISSING");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let prompt = `
    You are CancerFind, a comprehensive AI carcinogen analyst. 
    Analyze the following product input (${type}): "${input}"
    
    STRICT RULES:
    1. Categorize substances into IARC Groups (1, 2A, 2B, 3).
    2. Provide the specific Oncological Disease linked to each carcinogen (e.g., Leukemia, Gastric Cancer, Lung Cancer).
    3. Use IARC Monographs (Volumes 1-140) and WHO 2026 guidelines.
    4. Translate ALL medical terms and cancer types into ${language}.
    5. Return the result in JSON format matching the ScientificRiskReport interface.
    
    JSON Schema:
    {
      "carcinogens": [
        {
          "name": "string",
          "iarcGroup": "1|2A|2B|3",
          "linkedOncology": ["string"],
          "evaluationYear": number,
          "monographRef": "string",
          "exposureRoutes": ["string"],
          "evidenceStrength": "string",
          "safeLimits": "string"
        }
      ],
      "overallRisk": "Safe|Caution|High Risk",
      "assessment": "string",
      "recommendations": ["string"]
    }
  `;

  let result;
  if (type === 'image' && imageData) {
    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData.split(',')[1] || imageData
        }
      }
    ];
    result = await model.generateContent({ contents: [{ role: 'user', parts }] });
  } else {
    result = await model.generateContent(prompt);
  }

  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("JSON Parse Error:", e, text);
      throw new Error("FAILED_TO_PARSE_SCIENTIFIC_REPORT");
    }
  }
  
  throw new Error("FAILED_TO_PARSE_SCIENTIFIC_REPORT");
}
