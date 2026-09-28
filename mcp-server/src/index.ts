import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { evaluateScenario } from '../../lib/engine.js';
import { evaluateReadiness } from '../../lib/readiness.js';

const server = new McpServer({ name: 'palm92-capital-intelligence', version: '0.1.0' });

const pct = z.number().finite().min(0).max(100);
const money = z.number().finite().nonnegative().max(1_000_000_000_000);
const scenario = {
  name: z.string().trim().min(1).max(100),
  capital: money,
  expectedYield: z.number().finite().min(0).max(1),
  debtRate: z.number().finite().min(0).max(1),
  leverage: z.number().finite().min(0).max(10),
  stressDrop: z.number().finite().min(0).max(1),
};
const readiness = {
  utilisation: pct,
  debtToIncome: pct,
  reserveMonths: z.number().finite().min(0).max(120),
  recentApplications: z.number().int().min(0).max(100),
  missedPayments12m: z.number().int().min(0).max(12),
  documentationCompleteness: pct,
};

function response(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] };
}

const boundary = 'Synthetic or user-supplied planning inputs only. This is not a credit score, lender decision, financial recommendation or permission to borrow. Verify all assumptions with an authorised professional.';

server.registerTool('get_credit_readiness', {
  description: 'Score supplied planning factors using the same deterministic engine as the demo app. No credit bureau access or stored profile.',
  inputSchema: readiness,
}, async (input) => response({ ...evaluateReadiness(input), boundary }));

server.registerTool('run_capital_scenario', {
  description: 'Calculate an illustrative capital scenario using the demo app engine. Rates are decimals, so 0.05 means 5%.',
  inputSchema: scenario,
}, async (input) => response({ scenario: input.name, ...evaluateScenario(input), boundary }));

server.registerTool('run_downside_stress_test', {
  description: 'Show equity, leverage and annual net under a supplied downside scenario. Does not access live markets.',
  inputSchema: scenario,
}, async (input) => {
  const result = evaluateScenario(input);
  return response({ scenario: input.name, stressDrop: input.stressDrop, stressedAssetValue: result.stressedAssetValue,
    stressedEquity: result.stressedEquity, stressedLtv: result.stressedLtv,
    annualNet: result.annualNet, risk: result.risk, boundary });
});

server.registerTool('get_risk_summary', {
  description: 'Explain deterministic planning flags for one supplied scenario; does not approve finance.',
  inputSchema: scenario,
}, async (input) => {
  const result = evaluateScenario(input);
  const flags = [
    ...(result.stressedEquity < 0 ? ['Stressed equity is negative.'] : []),
    ...(result.annualNet < 0 ? ['Illustrative annual interest exceeds gross yield.'] : []),
    ...(result.stressedLtv >= 0.8 ? ['Stressed loan-to-value is at least 80%.'] : []),
  ];
  return response({ scenario: input.name, risk: result.risk, flags, noFlagsMeansSafe: false, boundary });
});

server.registerTool('get_evidence', {
  description: 'Return a generic evidence checklist; no private documents or external systems are queried.',
}, async () => response({ evidenceAvailable: false, checklist: [
  'Verify identity and consent before handling financial records.',
  'Collect dated income, expenditure, debt and reserve evidence through an approved secure channel.',
  'Record source, date, owner and review outcome for each item.',
  'Confirm lending terms, fees and downside assumptions with an authorised professional.',
], boundary }));

server.registerTool('get_capital_options', {
  description: 'Provide educational questions for comparing funding routes, with no ranking or recommendation.',
}, async () => response({ options: [
  { type: 'Own funds', questions: ['What emergency reserve remains after deployment?'] },
  { type: 'Borrowing', questions: ['What is the total cost, repayment schedule and downside cashflow?'] },
  { type: 'Partner capital', questions: ['Who bears losses and who can approve or exit the arrangement?'] },
], boundary }));

await server.connect(new StdioServerTransport());
