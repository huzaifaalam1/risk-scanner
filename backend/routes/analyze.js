const express = require("express");
const multer = require("multer");

const pdfService = require("../services/pdfService");
const geminiService = require("../services/geminiService");
const ruleEngine = require("../services/ruleEngine");
const riskFormatter = require("../services/riskFormatter");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1. Extract text
    const contractText = await pdfService.extractText(req.file.buffer);

    // 2. Rule-based risks
    const ruleRisks = ruleEngine.detectRisks(contractText);

    // 3. AI risks
    const aiRisks = await geminiService.analyze(contractText);

    // 4. Merge + format
    const finalResult = riskFormatter.combine(ruleRisks, aiRisks);

    res.json(finalResult);

  } catch (error) {
    console.error("Analyze Route Error:", error);
    res.status(500).json({ error: "Contract analysis failed" });
  }
});

module.exports = router;