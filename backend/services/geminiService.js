const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in environment variables");
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyze(text) {
  try {
    const prompt = `
You are a legal risk detection AI built for SMB founders.

Analyze the contract below and identify ONLY risk-related clauses.

For each risk return:
- category (Termination, Liability, Financial, Renewal, Restriction, Other)
- riskLevel (Low, Medium, High)
- clause (Exact excerpt from contract)
- reason (Why this is risky in plain English)

Respond ONLY in valid JSON with this exact format:

{
  "risks": [
    {
      "category": "...",
      "riskLevel": "...",
      "clause": "...",
      "reason": "..."
    }
  ]
}

Do not include markdown.
Do not include explanations.
Do not include backticks.

Contract:
${text}
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let rawText = response.text;

    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(rawText);

    return parsed;

  } catch (error) {
    console.error("Gemini Service Error:", error);
    return {
      risks: [],
      error: "AI analysis failed",
    };
  }
}

module.exports = { analyze };