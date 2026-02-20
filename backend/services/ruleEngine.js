/**
 * Detect deterministic legal risks using regex patterns
 * @param {string} text
 * @returns {Array}
 */
function detectRisks(text) {
  if (!text) return [];

  const risks = [];

  const rules = [
    {
      category: "Renewal",
      riskLevel: "High",
      regex: /.{0,150}(automatically renew|auto-renew|renewal term|successive terms).{0,150}/gi,
      explanation: "This contract may automatically renew unless properly terminated."
    },
    {
      category: "Liability",
      riskLevel: "High",
      regex: /.{0,150}(indemnify|hold harmless|defend and indemnify).{0,150}/gi,
      explanation: "You may be responsible for covering legal claims or losses."
    },
    {
      category: "Restriction",
      riskLevel: "Medium",
      regex: /.{0,150}(sole discretion|absolute discretion|at its discretion).{0,150}/gi,
      explanation: "One party has unilateral decision-making authority."
    },
    {
      category: "Termination",
      riskLevel: "High",
      regex: /.{0,150}(terminate at any time|without cause|may terminate this agreement).{0,150}/gi,
      explanation: "The agreement may be terminated without mutual consent."
    },
    {
      category: "Financial",
      riskLevel: "Medium",
      regex: /.{0,150}(increase fees|adjust pricing|escalate|subject to change|price revision).{0,150}/gi,
      explanation: "Pricing or fees may increase over time."
    }
  ];

  rules.forEach(rule => {
    const matches = text.match(rule.regex);

    if (matches) {
      matches.forEach(match => {
        risks.push({
          category: rule.category,
          riskLevel: rule.riskLevel,
          clause: match.trim(),
          reason: rule.explanation
        });
      });
    }
  });

  return risks;
}

module.exports = { detectRisks };