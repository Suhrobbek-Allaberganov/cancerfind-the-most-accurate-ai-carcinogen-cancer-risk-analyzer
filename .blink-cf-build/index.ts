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
