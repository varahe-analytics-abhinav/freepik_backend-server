const express = require('express');
const router = express.Router();

// Import your controller functions from their respective files
const { handleImageGeneration } = require('../controllers/imageController');
const { handleCreditsCheck } = require('../controllers/creditsController');

// Define the route for generating an image.
// This tells the server what to do when it receives a POST request
// to the "/generate-image" URL.
router.post('/generate-image', handleImageGeneration);

// Define the route for checking API credits.
// This handles GET requests to the "/check-credits" URL.
router.get('/check-credits', handleCreditsCheck);

// Export the router so it can be used by your main server.js file
module.exports = router;