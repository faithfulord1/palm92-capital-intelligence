# Capital Intelligence MCP server

The repository includes a working **local, read-only MCP server** using stdio. Its tools run the same deterministic readiness and scenario functions as the demo app. The server has no database connection, document access, payment tool, or external send capability. Enter only synthetic or appropriately authorised non-sensitive inputs.

## Run locally

Requires Node.js 22 or later.

```bash
npm ci --prefix mcp-server
npm run build --prefix mcp-server
npm test --prefix mcp-server
npm start --prefix mcp-server
```

An MCP desktop client can launch the executable at `<absolute-repo-path>/mcp-server/dist/mcp-server/src/index.js` with `node`. The process communicates through stdin and stdout; starting it in a normal terminal waits for a client connection. A remote ChatGPT connector requires a separately deployed, authenticated HTTP MCP endpoint, which this repository does not provide.

## Available tools

| Tool | Result |
| --- | --- |
| `get_credit_readiness` | Planning score from user-supplied factors, with no credit bureau lookup. |
| `run_capital_scenario` | Estimated outcomes using the application's scenario engine. |
| `run_downside_stress_test` | Stressed value, equity, loan-to-value and annual net. |
| `get_risk_summary` | Explainable flags for a supplied scenario. |
| `get_evidence` | Generic checklist only; no document retrieval. |
| `get_capital_options` | Educational comparison questions, with no funding recommendation. |

Rates and percentage stress drops in scenario inputs are decimals: `0.05` means 5%. Outputs are illustrative, not a credit score, lender approval, financial advice, or permission to borrow. There are no profile, dispute, approval, or adviser handoff tools because the demo has no authenticated users or durable evidence and approval store.
