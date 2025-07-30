const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use("/", apiRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
