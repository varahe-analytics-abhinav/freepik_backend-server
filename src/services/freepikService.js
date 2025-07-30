const fetch = require("node-fetch");

async function generateImage(apiKey, requestBody) {
  const response = await fetch("https://api.freepik.com/v1/ai/text-to-image/imagen3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-freepik-api-key": apiKey,
    },
    body: JSON.stringify(requestBody),
  });
  return response.json();
}

async function checkApiCredits(apiKey) {
  try {
    const response = await fetch("https://api.freepik.com/v1/me/ai-credits", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "x-freepik-api-key": apiKey,
      }
    });
    const data = await response.json();
    
    return {
      credits: data.available_credits || 0,
      status: response.status,
      isValid: response.ok,
      raw_response: data
    };
  } catch (error) {
    return { 
      credits: 0,
      status: error.status || 500,
      isValid: false,
      error: "Failed to check credits"
    };
  }
}

module.exports = { generateImage, checkApiCredits };