// services/ruleEngine.js

/**
 * Detect deterministic legal risks using regex
 * @param {string} text
 * @returns {Array}
 */
export function detectRisks(text) {
  if (!text) return [];

  const risks = [];

  const rules = [
    {
      category: "Auto Renewal",
      riskLevel: "High",
      regex: /.{0,150}(automatically renew|auto-renew|renewal term|successive terms).{0,150}/gi,
      explanation: "Contract may automatically renew unless cancelled."
    },
    {
      category: "Indemnification",
      riskLevel: "High",
      regex: /.{0,150}(indemnify|hold harmless|defend and indemnify).{0,150}/gi,
      explanation: "You may be responsible for covering losses or legal claims."
    },
    {
      category: "Sole Discretion",
      riskLevel: "Medium",
      regex: /.{0,150}(sole discretion|absolute discretion|at its discretion).{0,150}/gi,
      explanation: "One party has unilateral decision-making power."
    },
    {
      category: "Unilateral Termination",
      riskLevel: "High",
      regex: /.{0,150}(terminate at any time|without cause|may terminate this agreement).{0,150}/gi,
      explanation: "The agreement may be terminated without mutual consent."
    },
    {
      category: "Payment Escalation",
      riskLevel: "Medium",
      regex: /.{0,150}(increase fees|adjust pricing|escalate|subject to change|price revision).{0,150}/gi,
      explanation: "Pricing terms may change over time."
    }
  ];

  rules.forEach(rule => {
    const matches = text.match(rule.regex);
    if (matches) {
      matches.forEach(match => {
        risks.push({
          category: rule.category,
          riskLevel: rule.riskLevel,
          clauseExcerpt: match.trim(),
          explanation: rule.explanation
        });
      });
    }
  });

  return risks;
}
