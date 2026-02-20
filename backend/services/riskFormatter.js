function combine(ruleRisks, aiRisks) {
  return {
    risks: [...ruleRisks, ...aiRisks],
  };
}

module.exports = { combine };