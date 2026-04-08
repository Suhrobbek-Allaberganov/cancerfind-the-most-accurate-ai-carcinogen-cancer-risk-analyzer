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
  const backendUrl = "https://96v7t8q5.backend.blink.new";
  
  try {
    const response = await fetch(`${backendUrl}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        type,
        language,
        imageData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error === "api_key_missing") {
        throw new Error("GOOGLE_AI_API_KEY_MISSING");
      }
      if (errorData.error === "api_key_invalid") {
        throw new Error("GOOGLE_AI_API_KEY_INVALID");
      }
      throw new Error(errorData.details || errorData.error || "Scientific analysis failed. Please try again.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Analysis service error:", error);
    throw error;
  }
}