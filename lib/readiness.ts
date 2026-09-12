export type ReadinessInput = {
  utilisation: number;
  debtToIncome: number;
  reserveMonths: number;
  recentApplications: number;
  missedPayments12m: number;
  documentationCompleteness: number;
};

export type ReadinessFactor = {
  label: string;
  score: number;
  max: number;
  status: 'strong' | 'watch' | 'risk';
  explanation: string;
};

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function evaluateReadiness(input: ReadinessInput) {
  const utilisationScore = input.utilisation <= 30 ? 20 : input.utilisation <= 50 ? 14 : input.utilisation <= 75 ? 8 : 3;
  const dtiScore = input.debtToIncome <= 30 ? 20 : input.debtToIncome <= 40 ? 14 : input.debtToIncome <= 50 ? 8 : 3;
  const reserveScore = input.reserveMonths >= 6 ? 15 : input.reserveMonths >= 3 ? 11 : input.reserveMonths >= 1 ? 6 : 2;
  const applicationScore = input.recentApplications <= 1 ? 15 : input.recentApplications <= 3 ? 10 : input.recentApplications <= 5 ? 5 : 2;
  const missedScore = input.missedPayments12m === 0 ? 15 : input.missedPayments12m === 1 ? 8 : 2;
  const docsScore = Math.round(clamp(input.documentationCompleteness) * 0.15);

  const factors: ReadinessFactor[] = [
    { label: 'Credit utilisation', score: utilisationScore, max: 20, status: utilisationScore >= 14 ? 'strong' : utilisationScore >= 8 ? 'watch' : 'risk', explanation: `${input.utilisation}% of available revolving credit reported as used.` },
    { label: 'Debt-to-income', score: dtiScore, max: 20, status: dtiScore >= 14 ? 'strong' : dtiScore >= 8 ? 'watch' : 'risk', explanation: `${input.debtToIncome}% of gross monthly income committed to debt payments.` },
    { label: 'Liquidity reserve', score: reserveScore, max: 15, status: reserveScore >= 11 ? 'strong' : reserveScore >= 6 ? 'watch' : 'risk', explanation: `${input.reserveMonths} months of essential-cost reserves entered.` },
    { label: 'Recent applications', score: applicationScore, max: 15, status: applicationScore >= 10 ? 'strong' : applicationScore >= 5 ? 'watch' : 'risk', explanation: `${input.recentApplications} recent credit applications/searches entered.` },
    { label: 'Payment conduct', score: missedScore, max: 15, status: missedScore === 15 ? 'strong' : missedScore >= 8 ? 'watch' : 'risk', explanation: `${input.missedPayments12m} missed payments entered for the last 12 months.` },
    { label: 'Evidence completeness', score: docsScore, max: 15, status: docsScore >= 12 ? 'strong' : docsScore >= 8 ? 'watch' : 'risk', explanation: `${input.documentationCompleteness}% of the evidence checklist marked complete.` },
  ];

  const score = factors.reduce((sum, factor) => sum + factor.score, 0);
  const band = score >= 80 ? 'Strong' : score >= 65 ? 'Moderate' : score >= 50 ? 'Developing' : 'Not ready';

  return {
    score,
    band,
    factors,
    nextActions: factors
      .filter((f) => f.status !== 'strong')
      .map((f) => `Review ${f.label.toLowerCase()} before pursuing new funding.`)
      .slice(0, 4),
  };
}