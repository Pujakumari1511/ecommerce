const genAI = require("@google/genai");

const model = "gemini-2.0-flash";

const searchProductsTool = {
  name: "search_products",
  description: "Searches the e-commerce product catalog for items based on various criteria. This tool can filter by category, price, title, and rating.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "A search query for finding products by keywords in their title or description, e.g., 'backpack' or 'gaming monitor'."
      },
      category: {
        type: "string",
        enum: [
          "men's clothing",
          "women's clothing",
          "jewelery",
          "electronics"
        ],
        description: "The category of the product to search within."
      },
      price_min: {
        type: "number",
        description: "The minimum price of the product."
      },
      price_max: {
        type: "number",
        description: "The maximum price of the product."
      },
      rating_min: {
        type: "number",
        description: "The minimum rating of the product on a scale of 1 to 5."
      },
      rating_count_min: {
        type: "integer",
        description: "The minimum number of ratings a product must have."
      }
    }
  }
};

const config = {
    temperature: 0,
    tools: [{ functionDeclarations: [searchProductsTool] }],
    systemInstruction: "You are a helpful e-commerce search assistant. Your job is to extract product search criteria from a user's query and format it into a structured tool call. Do not respond to the user with natural language, only with the tool call.",
}

const filterProductsCatalog = (filterCriteria, products) => {
    let filteredProducts = [...products];
    if (filterCriteria.category){
        filteredProducts = filteredProducts.filter(product => product.category === filterCriteria.category);
    }

    if (filterCriteria.price_min !== undefined){
        filteredProducts = filteredProducts.filter(product => product.price >= filterCriteria.price_min);
    }

    if (filterCriteria.price_max !== undefined){
        filteredProducts = filteredProducts.filter(product => product.price <= filterCriteria.price_max);
    }

    if (filterCriteria.rating_min !== undefined){
        filteredProducts = filteredProducts.filter(product => product.rating.rate >= filterCriteria.rating_min);
    }

    if (filterCriteria.rating_count_min !== undefined){
        filteredProducts = filteredProducts.filter(product => product.rating.count >= filterCriteria.rating_count_min);
    }

    if (filterCriteria.query) {
        const queryLower = filterCriteria.query.toLowerCase();
        const filteredProductsByQuery = filteredProducts.filter(
            product =>
                product.title.toLowerCase().includes(queryLower) ||
                product.description.toLowerCase().includes(queryLower)
        );
        if (filteredProductsByQuery.length > 0) {
            filteredProducts = filteredProductsByQuery;
        }
    }

    return filteredProducts;
}

const getFilterFromGemini = async (userQuery, productCatalog) => {

    const googleGenAI = new genAI.GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const contents = [{
        role: "user",
        parts: [{
            text: userQuery,
        }]
    }]

    // AI api call to get the structured filter criteria
    const response = await googleGenAI.models.generateContent({
        model,
        contents,
        config
    });
    const part = response.candidates[0].content.parts
    .find(part => part.functionCall && part.functionCall.name == searchProductsTool.name);

    // Structured JSON filter criteria
    const filterCriteria = part.functionCall.args;

    return {
        filteredProducts: filterProductsCatalog(filterCriteria, productCatalog),
        filterCriteria,
    };
};

module.exports = { getFilterFromGemini };