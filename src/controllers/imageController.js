const Api_keys = require("../config/keys");
const { getRandomApiKey } = require("../utils/apiKeyUtils");
const { generateImage } = require("../services/freepikService");

async function handleImageGeneration(req, res) {
  try {
    const apiKey = getRandomApiKey(Api_keys);
    
    if (!apiKey) {
      return res.status(400).json({ error: "No API keys available" });
    }
    
    const data = await generateImage(apiKey, req.body);
    
    if (data.error && data.error.includes("insufficient_credits")) {
      const filteredKeys = Api_keys.filter(key => key !== apiKey);
      if (filteredKeys.length > 0) {
        const newApiKey = getRandomApiKey(filteredKeys);
        const retryData = await generateImage(newApiKey, req.body);
        return res.json(retryData);
      }
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
}

module.exports = { handleImageGeneration };