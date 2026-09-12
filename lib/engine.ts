export type Scenario = {
  name: string;
  capital: number;
  expectedYield: number;
  debtRate: number;
  leverage: number;
  stressDrop: number;
};

export function evaluateScenario(s: Scenario) {
  const debt = s.capital * s.leverage;
  const deployed = s.capital + debt;
  const annualGross = deployed * s.expectedYield;
  const annualInterest = debt * s.debtRate;
  const annualNet = annualGross - annualInterest;
  const stressedAssetValue = deployed * (1 - s.stressDrop);
  const stressedEquity = stressedAssetValue - debt;
  const ltv = debt === 0 ? 0 : debt / deployed;
  const stressedLtv = stressedAssetValue <= 0 ? 1 : debt / stressedAssetValue;
  const risk = stressedLtv >= 0.8 ? 'High' : stressedLtv >= 0.6 ? 'Medium' : 'Low';
  return { debt, deployed, annualGross, annualInterest, annualNet, stressedAssetValue, stressedEquity, ltv, stressedLtv, risk };
}

export function gbp(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
}