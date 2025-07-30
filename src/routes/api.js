const express = require("express");
const router = express.Router();
const { handleImageGeneration } = require("../controllers/imageController");
const { handleCreditsCheck } = require("../controllers/creditsController");
const Api_keys = require("../config/keys");

router.get("/api-keys", (req, res) => {
  try {
    res.json({ count: Api_keys.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch API keys count" });
  }
});

router.post("/classic-fast", handleImageGeneration);
router.get("/check-credits", handleCreditsCheck);

module.exports = router;