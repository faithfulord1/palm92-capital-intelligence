'use client';
import { useMemo, useState } from 'react';
import { evaluateScenario, gbp } from '@/lib/engine';
import { evaluateReadiness } from '@/lib/readiness';

const cards = [
  ['Credit Readiness', 'Understand profile strength before applying and flag genuine report discrepancies.'],
  ['Capital Options', 'Compare unsecured, property-backed, securities-backed, asset and business funding routes.'],
  ['Capital Flywheel', 'Model how surplus capital could be protected, deployed, reinvested and compounded.'],
  ['Wealth Risk', 'Stress-test rates, asset falls, income shocks, leverage and liquidity before a human decides.']
];

export default function Home() {
  const [capital, setCapital] = useState(50000);
  const [yieldRate, setYieldRate] = useState(8);
  const [debtRate, setDebtRate] = useState(6);
  const [leverage, setLeverage] = useState(50);
  const [stress, setStress] = useState(30);

  const [utilisation, setUtilisation] = useState(35);
  const [dti, setDti] = useState(28);
  const [reserveMonths, setReserveMonths] = useState(4);
  const [recentApplications, setRecentApplications] = useState(1);
  const [missedPayments, setMissedPayments] = useState(0);
  const [docs, setDocs] = useState(70);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const result = useMemo(() => evaluateScenario({
    name:'Demo',
    capital,
    expectedYield:yieldRate/100,
    debtRate:debtRate/100,
    leverage:leverage/100,
    stressDrop:stress/100
  }), [capital,yieldRate,debtRate,leverage,stress]);

  const readiness = useMemo(() => evaluateReadiness({
    utilisation,
    debtToIncome:dti,
    reserveMonths,
    recentApplications,
    missedPayments12m:missedPayments,
    documentationCompleteness:docs
  }), [utilisation,dti,reserveMonths,recentApplications,missedPayments,docs]);

  return <main>
    <section className="hero">
      <div className="eyebrow">PALM92 INTELLIGENCE</div>
      <h1>Capital decisions with the downside visible.</h1>
      <p className="lede">A governed capital-readiness and wealth-risk copilot. AI investigates. Humans decide. Evidence proves why.</p>
      <div className="badges"><span>UK-first</span><span>Explainable</span><span>Human-in-the-loop</span><span>Scenario driven</span></div>
    </section>

    <section className="grid four">{cards.map(([title,body]) => <article className="card" key={title}><div className="dot"/><h3>{title}</h3><p>{body}</p></article>)}</section>

    <section className="intake">
      <div className="sectionHead">
        <div>
          <div className="eyebrow">DOCUMENT INTAKE</div>
          <h2>Bring the evidence into one case.</h2>
          <p className="sectionCopy">For this portfolio MVP, files stay in your browser session. The app records file names only and does not claim to extract PDF data yet.</p>
        </div>
        <div className="privacyBadge">Local demo intake</div>
      </div>

      <div className="intakeGrid">
        <label className="dropzone">
          <input
            type="file"
            multiple
            accept=".pdf,.csv,.txt,.json"
            onChange={e => setSelectedFiles(Array.from(e.target.files ?? []).map(f => f.name))}
          />
          <strong>Add financial evidence</strong>
          <span>Credit report, bank statement export, accounts summary or supporting evidence</span>
          <small>PDF, CSV, TXT or JSON • demo mode</small>
        </label>

        <div className="evidencePanel">
          <div className="panelTitle">Evidence register</div>
          {selectedFiles.length === 0
            ? <p className="muted">No files selected yet.</p>
            : selectedFiles.map((name, i) => <div className="evidenceRow" key={name + i}><span>{String(i+1).padStart(2,'0')}</span><b>{name}</b><em>Selected</em></div>)}
          <div className="notice compact"><b>Privacy boundary:</b> do not upload highly sensitive documents to a public demo. Production storage, encryption, retention and access controls must be implemented before real customer use.</div>
        </div>
      </div>
    </section>

    <section className="readiness">
      <div className="sectionHead">
        <div>
          <div className="eyebrow">CAPITAL READINESS</div>
          <h2>Explain the score, not just the number.</h2>
        </div>
        <div className="scoreCard"><strong>{readiness.score}</strong><span>/100</span><small>{readiness.band}</small></div>
      </div>

      <div className="readinessGrid">
        <div className="controls readinessControls">
          <label>Credit utilisation <b>{utilisation}%</b><input type="range" min="0" max="100" value={utilisation} onChange={e=>setUtilisation(+e.target.value)} /></label>
          <label>Debt-to-income <b>{dti}%</b><input type="range" min="0" max="80" value={dti} onChange={e=>setDti(+e.target.value)} /></label>
          <label>Liquidity reserve <b>{reserveMonths} months</b><input type="range" min="0" max="12" value={reserveMonths} onChange={e=>setReserveMonths(+e.target.value)} /></label>
          <label>Recent applications <b>{recentApplications}</b><input type="range" min="0" max="10" value={recentApplications} onChange={e=>setRecentApplications(+e.target.value)} /></label>
          <label>Missed payments, 12 months <b>{missedPayments}</b><input type="range" min="0" max="6" value={missedPayments} onChange={e=>setMissedPayments(+e.target.value)} /></label>
          <label>Evidence completeness <b>{docs}%</b><input type="range" min="0" max="100" value={docs} onChange={e=>setDocs(+e.target.value)} /></label>
        </div>

        <div className="factorList">
          {readiness.factors.map(f => <div className="factor" key={f.label}>
            <div><b>{f.label}</b><span className={'status ' + f.status}>{f.status}</span></div>
            <strong>{f.score}/{f.max}</strong>
            <p>{f.explanation}</p>
          </div>)}
        </div>
      </div>

      <div className="actionPanel">
        <div className="panelTitle">Priority actions before new funding</div>
        {readiness.nextActions.length
          ? readiness.nextActions.map((a,i)=><div className="actionRow" key={a}><span>{i+1}</span>{a}</div>)
          : <div className="actionRow"><span>✓</span>No material readiness flags from the entered demo data. Continue to product-specific eligibility checks and human review.</div>}
      </div>

      <div className="notice"><b>Important:</b> this score is a Palm92 planning indicator, not a credit score, lender approval probability or recommendation to borrow.</div>
    </section>

    <section className="simulator">
      <div className="sectionHead"><div><div className="eyebrow">CAPITAL SCENARIO SIMULATOR</div><h2>Model the upside. Stress the failure case.</h2></div><div className={'risk ' + result.risk.toLowerCase()}>{result.risk} stressed risk</div></div>
      <div className="simgrid">
        <div className="controls">
          <label>Starting capital <b>{gbp(capital)}</b><input type="range" min="5000" max="250000" step="5000" value={capital} onChange={e=>setCapital(+e.target.value)} /></label>
          <label>Expected asset yield <b>{yieldRate}%</b><input type="range" min="0" max="20" value={yieldRate} onChange={e=>setYieldRate(+e.target.value)} /></label>
          <label>Borrowing rate <b>{debtRate}%</b><input type="range" min="0" max="20" value={debtRate} onChange={e=>setDebtRate(+e.target.value)} /></label>
          <label>Borrowing vs capital <b>{leverage}%</b><input type="range" min="0" max="100" step="5" value={leverage} onChange={e=>setLeverage(+e.target.value)} /></label>
          <label>Stress test: asset fall <b>{stress}%</b><input type="range" min="0" max="60" step="5" value={stress} onChange={e=>setStress(+e.target.value)} /></label>
        </div>
        <div className="metrics">
          <div><small>Total deployed</small><strong>{gbp(result.deployed)}</strong></div>
          <div><small>Borrowing</small><strong>{gbp(result.debt)}</strong></div>
          <div><small>Illustrative net annual cash flow</small><strong>{gbp(result.annualNet)}</strong></div>
          <div><small>Equity after {stress}% fall</small><strong>{gbp(result.stressedEquity)}</strong></div>
          <div><small>Starting LTV</small><strong>{Math.round(result.ltv*100)}%</strong></div>
          <div><small>Stressed LTV</small><strong>{Math.round(result.stressedLtv*100)}%</strong></div>
        </div>
      </div>
      <div className="notice"><b>Governance gate:</b> This simulator is educational decision support, not a lending decision, tax advice or investment recommendation. Real-world action requires verified product terms and appropriate professional review.</div>
    </section>

    <section className="flow">
      <div className="eyebrow">GOVERNED FLOW</div>
      <h2>From evidence to decision</h2>
      <div className="steps">
        {['Collect evidence','Extract financial facts','Assess readiness','Compare capital routes','Stress-test scenarios','Flag tax/legal review','Human approves','Preserve audit trail'].map((x,i)=><div className="step" key={x}><span>{String(i+1).padStart(2,'0')}</span>{x}</div>)}
      </div>
    </section>
  </main>
}