'use client';
import { useMemo, useState } from 'react';
import { evaluateScenario, gbp } from '@/lib/engine';

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
  const result = useMemo(() => evaluateScenario({name:'Demo', capital, expectedYield:yieldRate/100, debtRate:debtRate/100, leverage:leverage/100, stressDrop:stress/100}), [capital,yieldRate,debtRate,leverage,stress]);

  return <main>
    <section className="hero">
      <div className="eyebrow">PALM92 INTELLIGENCE</div>
      <h1>Capital decisions with the downside visible.</h1>
      <p className="lede">A governed capital-readiness and wealth-risk copilot. AI investigates. Humans decide. Evidence proves why.</p>
      <div className="badges"><span>UK-first</span><span>Explainable</span><span>Human-in-the-loop</span><span>Scenario driven</span></div>
    </section>

    <section className="grid four">{cards.map(([title,body]) => <article className="card" key={title}><div className="dot"/><h3>{title}</h3><p>{body}</p></article>)}</section>

    <section className="simulator">
      <div className="sectionHead"><div><div className="eyebrow">CAPITAL SCENARIO SIMULATOR</div><h2>Model the upside. Stress the failure case.</h2></div><div className={`risk ${result.risk.toLowerCase()}`}>{result.risk} stressed risk</div></div>
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