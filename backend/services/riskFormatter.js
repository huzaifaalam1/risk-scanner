function combine(ruleRisks, aiResult) {
  return {
    risks: [
      ...ruleRisks,
      ...(aiResult?.risks || [])
    ]
  };
}

module.exports = { combine };