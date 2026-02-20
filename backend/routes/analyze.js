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

    const contractText = await pdfService.extractText(req.file.buffer);

    const ruleRisks = ruleEngine.detectRisks(contractText);
    const aiResult = await geminiService.analyze(contractText);

    const finalResult = riskFormatter.combine(ruleRisks, aiResult);

    res.json(finalResult);

  } catch (error) {
    console.error("Analyze Route Error:", error);
    res.status(500).json({ error: "Contract analysis failed" });
  }
});

module.exports = router;