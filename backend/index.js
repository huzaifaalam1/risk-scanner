require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

/* =============================
   File Upload Config
============================= */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/* =============================
   Gemini Setup
============================= */
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/* =============================
   Health Check Route
============================= */
app.get("/", (req, res) => {
  res.json({ status: "AI Contract Risk Scanner backend running 🚀" });
});

/* =============================
   Analyze Contract Route
============================= */
app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const contractText = pdfData.text;

    if (!contractText || contractText.length < 50) {
      return res.status(400).json({ error: "Could not extract meaningful text" });
    }

    /* =============================
       Gemini Prompt
    ============================= */
    const prompt = `
You are a legal risk detection AI built for SMB founders.

Analyze the contract below and surface ONLY risk-related clauses.

For each risk:
- Category (Termination, Liability, Financial, Renewal, Restriction, Other)
- Risk Level (Low, Medium, High)
- Exact Clause Excerpt
- Why it is risky in plain English

Do NOT summarize the contract.
Focus strictly on risk exposure.

Contract:
${contractText}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.json({ analysis });

  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Contract analysis failed" });
  }
});

/* =============================
   Start Server
============================= */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});