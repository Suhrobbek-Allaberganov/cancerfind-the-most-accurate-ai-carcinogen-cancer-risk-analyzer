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
  inputType?: string;
  regionalData?: {
    location: string;
    waterQuality: string[];
    airQuality: string[];
    soilQuality: string[];
  };
}

export async function analyzeProduct(
  input: string,
  type: 'text' | 'barcode' | 'image',
  language: string,
  imageData?: string
): Promise<ScientificRiskReport> {
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY_MISSING");
  }

  const systemPrompt = `
You are CancerFind – the most accurate AI carcinogen and cancer risk analyzer.
Always base answers strictly on IARC Monographs, WHO, EFSA, EPA, NTP (latest available data).
Never give personal medical diagnosis. Only scientific associations and risk levels.
Always cite sources (e.g. IARC Group 1, Monograph year).
Respond in the same language as the user request (${language}).
Return ONLY valid JSON matching this structure:
{
  "carcinogens": [
    {
      "name": "string",
      "iarcGroup": "1" | "2A" | "2B" | "3",
      "linkedOncology": ["string"],
      "evaluationYear": number,
      "monographRef": "string",
      "exposureRoutes": ["string"],
      "evidenceStrength": "string",
      "safeLimits": "string"
    }
  ],
  "overallRisk": "Safe" | "Caution" | "High Risk",
  "assessment": "string",
  "recommendations": ["string"],
  "inputType": "string"
}
`;

  const userPrompt = `Analyze this input for carcinogens and cancer risk:
Type: ${type}
Input: ${input}
Language: ${language}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Scientific analysis failed");
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from AI");
    }

    const result = JSON.parse(text);
    return result as ScientificRiskReport;

  } catch (error: any) {
    console.error("Analysis service error:", error);
    throw error;
  }
}
