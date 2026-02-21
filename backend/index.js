require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");

const app = express();

app.use(cors());
app.use(express.json());

/* Health Check */
app.get("/", (req, res) => {
  res.json({ status: "AI Contract Risk Scanner backend running 🚀" });
});

/* Analyze Route */
app.use("/analyze", analyzeRoute);

/* Start Server */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});