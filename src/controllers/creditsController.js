const Api_keys = require("../config/keys");
const { checkApiCredits } = require("../services/freepikService");

async function handleCreditsCheck(req, res) {
  try {
    const creditsInfo = [];
    let totalCredits = 0;
    
    for (const apiKey of Api_keys) {
      const info = await checkApiCredits(apiKey);
      const maskedKey = apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4);
      
      if (info.isValid) {
        totalCredits += info.credits;
      }
      
      creditsInfo.push({
        key: maskedKey,
        credits: info.credits,
        status: info.status,
        isValid: info.isValid,
        raw_response: info.raw_response,
        error: info.error || null
      });
    }
    
    res.json({
      total_keys: Api_keys.length,
      total_credits: totalCredits,
      credits_info: creditsInfo
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch credits information" });
  }
}

module.exports = { handleCreditsCheck };