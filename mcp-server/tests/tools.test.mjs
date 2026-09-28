import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

test('MCP client receives app calculations and rejects invalid planning inputs', async () => {
  const client = new Client({ name: 'capital-smoke-test', version: '1.0.0' });
  const transport = new StdioClientTransport({ command: process.execPath, args: ['dist/mcp-server/src/index.js'] });
  try {
    await client.connect(transport);
    const names = (await client.listTools()).tools.map((tool) => tool.name);
    assert.deepEqual(names.sort(), ['get_capital_options', 'get_credit_readiness', 'get_evidence', 'get_risk_summary', 'run_capital_scenario', 'run_downside_stress_test'].sort());

    const scenario = { name: 'synthetic stress', capital: 100000, expectedYield: 0.07, debtRate: 0.06, leverage: 1, stressDrop: 0.3 };
    const outcome = await client.callTool({ name: 'run_downside_stress_test', arguments: scenario });
    const value = JSON.parse(outcome.content[0].text);
    assert.equal(value.stressedAssetValue, 140000);
    assert.equal(value.stressedEquity, 40000);
    assert.equal(value.risk, 'Medium');

    const invalid = await client.callTool({ name: 'run_capital_scenario', arguments: { ...scenario, stressDrop: 1.5 } });
    assert.equal(invalid.isError, true);
  } finally {
    await client.close();
  }
});
