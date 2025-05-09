const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://abhinav:abhinav@cluster0.pdhmv7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" || "mongodb://localhost:27017/freepik-api", {
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


const Api_keys = [
"FPSX79cdf01c7e744207beae0ad0c4fee600",
"FPSX6a436ebe79d94d24bdc9d5115c68b40a",
"FPSXa767f3ad58ca4808b4d485117e4eb982",
"FPSXe23c7b576b804161985ad9fe2f2e9bf1",
"FPSX9caef57f2d5e493598d05bc9eb90ca59"

]


const DEFAULT_API_KEY = "FPSX79cdf01c7e744207beae0ad0c4fee600";


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
