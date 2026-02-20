const express = require("express");

const geminiService = require("../services/geminiService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const contractText = `
This agreement will automatically renew for successive one-year terms unless either party provides written notice of termination at least 90 days before the renewal date.
The client agrees to indemnify and hold harmless the vendor against any and all claims.
The vendor may terminate this agreement at its sole discretion at any time.
`;

    const aiResult = await geminiService.analyze(contractText);
    return res.json(aiResult);
  } catch (error) {
    console.error("Analyze Route Error:", error);
    return res.status(500).json({ error: "Contract analysis failed" });
  }
});

module.exports = router;