const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/freepik-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// API Key Model
const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date },
});

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

// Load API keys from environment variables
const Api_keys = [
  process.env.API_KEY_1,
  process.env.API_KEY_2,
  process.env.API_KEY_3,
  process.env.API_KEY_4,
  process.env.API_KEY_5
].filter(Boolean); // Filter out any undefined keys

const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY;

// API endpoint to store a new API key
app.post("/api-keys", async (req, res) => {
  try {
    const { key, name } = req.body;
    
    if (!key || !name) {
      return res.status(400).json({ error: "API key and name are required" });
    }
    
    const newApiKey = new ApiKey({ key, name });
    await newApiKey.save();
    
    res.status(201).json({ message: "API key stored successfully", apiKey: newApiKey });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({ error: "API key already exists" });
    }
    res.status(500).json({ error: "Failed to store API key", details: error.message });
  }
});

// API endpoint to get all API keys
app.get("/api-keys", async (req, res) => {
  try {
    const apiKeys = await ApiKey.find({}, { key: 0 }); // Exclude the actual key for security
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch API keys" });
  }
});

app.post("/generate-image", async (req, res) => {
  try {
    // Get the first API key from MongoDB, or use default if none exists
    let apiKey = DEFAULT_API_KEY;
    
    const apiKeyDoc = await ApiKey.findOne();
    if (apiKeyDoc) {
      apiKey = apiKeyDoc.key;
      
      // Update lastUsed timestamp
      await ApiKey.updateOne({ _id: apiKeyDoc._id }, { lastUsed: new Date() });
    }
    
    const response = await fetch("https://api.freepik.com/v1/ai/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-freepik-api-key": apiKey,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
