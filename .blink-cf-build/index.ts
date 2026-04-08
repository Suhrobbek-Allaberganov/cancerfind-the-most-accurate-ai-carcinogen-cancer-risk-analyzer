import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient } from "@blinkdotnew/sdk";

const app = new Hono();

app.use("*", cors());

const getBlink = (c: any) =>
  createClient({
    projectId: c.env.BLINK_PROJECT_ID,
    secretKey: c.env.BLINK_SECRET_KEY,
  });

app.get("/", (c) => c.text("CancerFind Backend API"));

app.post("/analyze", async (c) => {
  const { input, type, language, imageData } = await c.req.json();
  
  if (!c.env.GOOGLE_AI_API_KEY) {
    console.error("Backend: GOOGLE_AI_API_KEY is missing");
    return c.json({ error: "api_key_missing" }, 400);
  }

  const aiKey = c.env.GOOGLE_AI_API_KEY;
  
  // Try a comprehensive list of model names
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.0-pro"
  ];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Backend: Attempting analysis with ${modelName} via REST`);
      
      let prompt = `
        You are CancerFind, a comprehensive AI carcinogen analyst. 
        Analyze the following product input (${type}): "${input}"
        
        STRICT RULES:
        1. Categorize substances into IARC Groups (1, 2A, 2B, 3).
        2. Provide the specific Oncological Disease linked to each carcinogen (e.g., Leukemia, Gastric Cancer, Lung Cancer).
        3. Use IARC Monographs (Volumes 1-140) and WHO 2026 guidelines.
        4. Translate ALL medical terms and cancer types into ${language}.
        5. Return the result in JSON format matching the following interface:
        
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

      let parts = [];
      if (type === 'image' && imageData) {
        parts = [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageData.split(',')[1] || imageData
            }
          }
        ];
      } else {
        parts = [{ text: prompt }];
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${aiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log(`Backend: AI Response received from ${modelName}`);

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return c.json(parsed);
        } catch (parseError) {
          console.error(`Backend: JSON Parse Error with ${modelName}`, parseError);
        }
      } else {
        console.error(`Backend: No JSON found in AI response from ${modelName}`);
      }
    } catch (error: any) {
      console.error(`Backend: Analysis failed with ${modelName}:`, error.message);
      lastError = error;
      
      if (error.message?.includes("API key not valid")) {
        return c.json({ error: "api_key_invalid", details: error.message }, 401);
      }
      
      // Continue to next model for most errors
      continue;
    }
  }

  return c.json({ 
    error: "Analysis failed", 
    details: lastError?.message || "All models failed to return a valid report",
    triedModels: modelsToTry 
  }, 500);
});

app.post("/batch-populate", async (c) => {
  const blink = getBlink(c);
  try {
    const { category, page = 1 } = await c.req.json();
    if (!category) {
      return c.json({ error: "Category is required" }, 400);
    }

    const allDbCarcinogens = await blink.db.carcinogens.list();

    const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${category}&page=${page}&page_size=20&json=true`, {
      signal: AbortSignal.timeout(20000)
    });
    const data: any = await response.json();
    const products = data.products || [];

    const results = [];

    for (const product of products) {
      const { 
        product_name: name, 
        brands: brand, 
        categories: prodCategories, 
        ingredients_text: ingredientsText, 
        image_url: imageUrl,
        _id: openFoodFactsId
      } = product;

      if (!ingredientsText || !name) continue;

      const exists = await blink.db.products.exists({ where: { openFoodFactsId } });
      if (exists) continue;

      const identifiedCarcinogens = allDbCarcinogens.filter(carc => 
        ingredientsText.toLowerCase().includes(carc.name.toLowerCase())
      );

      const newProduct = await blink.db.products.create({
        name,
        brand: brand || "Generic",
        categories: JSON.stringify(prodCategories ? prodCategories.split(",") : []),
        ingredientsText,
        imageUrl,
        openFoodFactsId
      });

      for (const carcinogen of identifiedCarcinogens) {
        await blink.db.productCarcinogens.create({
          productId: newProduct.id,
          carcinogenId: carcinogen.id
        });
      }

      results.push({ name, brand, carcinogens: identifiedCarcinogens.map(carc => carc.name) });
    }

    return c.json({ success: true, processed: results.length });
  } catch (error: any) {
    console.error("Error:", error);
    return c.json({ error: "Internal error", details: error.message }, 500);
  }
});

app.post("/populate-data", async (c) => {
  const blink = getBlink(c);
  try {
    const categories = ["meat", "soda", "snacks", "beverages", "confectionery", "cereal", "sauce", "canned", "dairy"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomPage = Math.floor(Math.random() * 5) + 1;
    
    const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${randomCategory}&page=${randomPage}&page_size=5&json=true`, {
      signal: AbortSignal.timeout(20000)
    });
    const data: any = await response.json();
    const products = data.products || [];

    const results = [];
    const allDbCarcinogens = await blink.db.carcinogens.list();

    for (const product of products) {
      const { 
        product_name: name, 
        brands: brand, 
        categories: prodCategories, 
        ingredients_text: ingredientsText, 
        image_url: imageUrl,
        _id: openFoodFactsId
      } = product;

      if (!ingredientsText || !name) continue;

      const exists = await blink.db.products.exists({ where: { openFoodFactsId } });
      if (exists) continue;

      const identifiedCarcinogens = allDbCarcinogens.filter(carc => 
        ingredientsText.toLowerCase().includes(carc.name.toLowerCase())
      );

      const newProduct = await blink.db.products.create({
        name,
        brand: brand || "Generic",
        categories: JSON.stringify(prodCategories ? prodCategories.split(",") : []),
        ingredientsText,
        imageUrl,
        openFoodFactsId
      });

      for (const carcinogen of identifiedCarcinogens) {
        await blink.db.productCarcinogens.create({
          productId: newProduct.id,
          carcinogenId: carcinogen.id
        });
      }

      results.push({ name, brand, carcinogens: identifiedCarcinogens.map(carc => carc.name) });
    }

    return c.json({ success: true, category: randomCategory, processed: results.length, results });
  } catch (error: any) {
    console.error("Error:", error);
    return c.json({ error: "Internal error", details: error.message }, 500);
  }
});

export default app;