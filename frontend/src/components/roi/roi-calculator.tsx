"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  formatCurrency,
  formatHours,
  getCurrencyRate,
  type CurrencyCode,
} from "@/lib/roi/format";

import { RangeField } from "./range-field";
import "./roi.css";

type Tab = "firm" | "inhouse";

const CURRENCIES: { code: CurrencyCode; sym: string; label: string }[] = [
  { code: "INR", sym: "₹", label: "₹ INR" },
  { code: "USD", sym: "$", label: "$ USD" },
  { code: "GBP", sym: "£", label: "£ GBP" },
];

const DEFAULTS = {
  firm: {
    lawyers: 15,
    hours: 1400,
    rate: 8000,
    nonbill: 30,
    saving: 35,
    convert: 40,
    margin: 35,
  },
  inhouse: {
    lawyers: 4,
    cost: 1_500_000,
    routine: 15,
    saving: 40,
    extrate: 12_000,
    shift: 25,
  },
};

function scaleValue(base: number, rate: number, round = true): number {
  const v = base * rate;
  return round ? Math.round(v) : v;
}

export function RoiCalculator() {
  const [tab, setTab] = useState<Tab>("firm");
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const rate = getCurrencyRate(currency.code);

  const [firm, setFirm] = useState({
    ...DEFAULTS.firm,
    rate: scaleValue(DEFAULTS.firm.rate, rate),
  });

  const [inhouse, setInhouse] = useState({
    ...DEFAULTS.inhouse,
    cost: scaleValue(DEFAULTS.inhouse.cost, rate),
    extrate: scaleValue(DEFAULTS.inhouse.extrate, rate),
  });

  function setCurrencyCode(code: CurrencyCode) {
    const next = CURRENCIES.find((c) => c.code === code)!;
    const r = getCurrencyRate(code);
    setCurrency(next);
    setFirm((f) => ({ ...f, rate: scaleValue(8000, r) }));
    setInhouse((ih) => ({
      ...ih,
      cost: scaleValue(1_500_000, r),
      extrate: scaleValue(12_000, r),
    }));
  }

  const firmResults = useMemo(() => {
    const { lawyers, hours, rate: billingRate } = firm;
    const nonbill = firm.nonbill / 100;
    const savPct = firm.saving / 100;
    const convPct = firm.convert / 100;
    const margin = firm.margin / 100;

    const nonBillHrs = hours * nonbill;
    const savedPerLawyer = nonBillHrs * savPct;
    const totalSavedHrs = savedPerLawyer * lawyers;
    const totalBillHrs = totalSavedHrs * convPct;
    const totalRev = totalBillHrs * billingRate;
    const totalProfit = totalRev * margin;
    const revPerLawyer = totalRev / lawyers;

    return {
      nonBillHrs,
      savedPerLawyer,
      totalSavedHrs,
      totalBillHrs,
      totalRev,
      totalProfit,
      revPerLawyer,
      savPct,
      convPct,
      margin,
      lawyers,
      bT: Math.min(100, savPct * 150),
      bB: Math.min(100, convPct * 125),
      bA: Math.min(100, margin * 160),
    };
  }, [firm]);

  const inhouseResults = useMemo(() => {
    const { lawyers, cost, routine, extrate } = inhouse;
    const savPct = inhouse.saving / 100;
    const shiftPct = inhouse.shift / 100;

    const annualRoutine = routine * 52 * lawyers;
    const savedHrs = annualRoutine * savPct;
    const internalRate = cost / 2080;
    const internalSaving = savedHrs * internalRate;
    const externalSaving = annualRoutine * shiftPct * extrate;
    const totalSaving = internalSaving + externalSaving;
    const perLawyerMo = savedHrs / lawyers / 12;

    return {
      annualRoutine,
      savedHrs,
      internalSaving,
      externalSaving,
      totalSaving,
      perLawyerMo,
      savPct,
      shiftPct,
      lawyers,
      bT: Math.min(100, savPct * 150),
      bB: Math.min(100, shiftPct * 300),
      bA: Math.min(100, (internalSaving / totalSaving) * 100),
    };
  }, [inhouse]);

  const fmt = (n: number) => formatCurrency(n, currency.sym, currency.code);

  return (
    <>
      <section className="roi-hero">
        <div className="hero-rule" />
        <p className="ey">ROI Calculator</p>
        <h1>
          See LawInd&apos;s impact
          <br />
          on <em>your practice</em>
        </h1>
        <p>
          Estimate how AI-assisted legal workflows convert non-billable time
          into revenue and cost savings — using conservative,
          research-informed assumptions.
        </p>
        <div className="hero-stats">
          <div>
            <span className="hstat-n">93%</span>
            <div className="hstat-l">Report reduced non-billable time</div>
          </div>
          <div>
            <span className="hstat-n">37 hrs</span>
            <div className="hstat-l">Saved per month by power users</div>
          </div>
          <div>
            <span className="hstat-n">83%</span>
            <div className="hstat-l">Improved client relationships</div>
          </div>
        </div>
      </section>

      <div className="roi-controls">
        <div className="roi-tabs">
          <button
            type="button"
            className={`tab-btn${tab === "firm" ? " active" : ""}`}
            onClick={() => setTab("firm")}
          >
            Law Firm
          </button>
          <button
            type="button"
            className={`tab-btn${tab === "inhouse" ? " active" : ""}`}
            onClick={() => setTab("inhouse")}
          >
            In-House
          </button>
        </div>
        <div className="curr-group">
          <span className="curr-lbl">Currency:</span>
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`curr-btn${currency.code === c.code ? " active" : ""}`}
              onClick={() => setCurrencyCode(c.code)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="roi-main">
        <div className="input-panel">
          {tab === "firm" ? (
            <>
              <div className="panel-head">
                <div className="panel-head-title">Firm parameters</div>
              </div>
              <div className="panel-body">
                <RangeField
                  label="Number of fee earners"
                  value={firm.lawyers}
                  displayValue={String(firm.lawyers)}
                  min={2}
                  max={200}
                  step={1}
                  onChange={(v) => setFirm((f) => ({ ...f, lawyers: v }))}
                />
                <RangeField
                  label="Avg billable hours per year"
                  value={firm.hours}
                  displayValue={`${firm.hours.toLocaleString()} hrs`}
                  min={600}
                  max={2400}
                  step={50}
                  onChange={(v) => setFirm((f) => ({ ...f, hours: v }))}
                />
                <hr className="field-divider" />
                <RangeField
                  label={
                    <>
                      Avg billing rate ({currency.sym}/hr)
                    </>
                  }
                  value={firm.rate}
                  displayValue={fmt(firm.rate)}
                  min={scaleValue(1000, rate)}
                  max={scaleValue(50000, rate)}
                  step={scaleValue(500, rate) || 1}
                  onChange={(v) => setFirm((f) => ({ ...f, rate: v }))}
                />
                <RangeField
                  label="Non-billable time (% of total)"
                  value={firm.nonbill}
                  displayValue={`${firm.nonbill}%`}
                  min={10}
                  max={60}
                  step={1}
                  onChange={(v) => setFirm((f) => ({ ...f, nonbill: v }))}
                />
                <hr className="field-divider" />
                <RangeField
                  label="AI time savings on non-billable work"
                  value={firm.saving}
                  displayValue={`${firm.saving}%`}
                  min={10}
                  max={60}
                  step={1}
                  onChange={(v) => setFirm((f) => ({ ...f, saving: v }))}
                />
                <RangeField
                  label="Recovered time converted to billable"
                  value={firm.convert}
                  displayValue={`${firm.convert}%`}
                  min={10}
                  max={80}
                  step={5}
                  onChange={(v) => setFirm((f) => ({ ...f, convert: v }))}
                />
                <RangeField
                  label="Profit margin on new revenue"
                  value={firm.margin}
                  displayValue={`${firm.margin}%`}
                  min={10}
                  max={60}
                  step={5}
                  onChange={(v) => setFirm((f) => ({ ...f, margin: v }))}
                />
              </div>
            </>
          ) : (
            <>
              <div className="panel-head">
                <div className="panel-head-title">Team parameters</div>
              </div>
              <div className="panel-body">
                <RangeField
                  label="Number of in-house lawyers"
                  value={inhouse.lawyers}
                  displayValue={String(inhouse.lawyers)}
                  min={1}
                  max={100}
                  step={1}
                  onChange={(v) => setInhouse((ih) => ({ ...ih, lawyers: v }))}
                />
                <RangeField
                  label={
                    <>
                      Avg fully-loaded cost ({currency.sym}/yr)
                    </>
                  }
                  value={inhouse.cost}
                  displayValue={fmt(inhouse.cost)}
                  min={scaleValue(500_000, rate)}
                  max={scaleValue(5_000_000, rate)}
                  step={scaleValue(100_000, rate) || 1}
                  onChange={(v) => setInhouse((ih) => ({ ...ih, cost: v }))}
                />
                <hr className="field-divider" />
                <RangeField
                  label="Hours/week on routine tasks"
                  value={inhouse.routine}
                  displayValue={`${inhouse.routine} hrs`}
                  min={4}
                  max={40}
                  step={1}
                  onChange={(v) => setInhouse((ih) => ({ ...ih, routine: v }))}
                />
                <RangeField
                  label="AI reduction in routine workload"
                  value={inhouse.saving}
                  displayValue={`${inhouse.saving}%`}
                  min={10}
                  max={70}
                  step={5}
                  onChange={(v) => setInhouse((ih) => ({ ...ih, saving: v }))}
                />
                <hr className="field-divider" />
                <RangeField
                  label={
                    <>
                      External counsel rate ({currency.sym}/hr)
                    </>
                  }
                  value={inhouse.extrate}
                  displayValue={fmt(inhouse.extrate)}
                  min={scaleValue(5000, rate)}
                  max={scaleValue(50000, rate)}
                  step={scaleValue(1000, rate) || 1}
                  onChange={(v) => setInhouse((ih) => ({ ...ih, extrate: v }))}
                />
                <RangeField
                  label="Work shifted from external counsel"
                  value={inhouse.shift}
                  displayValue={`${inhouse.shift}%`}
                  min={5}
                  max={60}
                  step={5}
                  onChange={(v) => setInhouse((ih) => ({ ...ih, shift: v }))}
                />
              </div>
            </>
          )}
        </div>

        <div className="results-stack">
          {tab === "firm" ? (
            <FirmResults r={firmResults} fmt={fmt} />
          ) : (
            <InhouseResults r={inhouseResults} fmt={fmt} />
          )}
        </div>
      </div>

      <div className="trust-section">
        <div className="trust-title">
          Based on research across Indian legal professionals
        </div>
        <div className="trust-stats">
          <div className="trust-stat">
            <span className="trust-stat-num">1.7M</span>
            <div className="trust-stat-lbl">Indian lawyers</div>
          </div>
          <div className="trust-stat">
            <span className="trust-stat-num">18+ hrs</span>
            <div className="trust-stat-lbl">Saved per lawyer per month</div>
          </div>
          <div className="trust-stat">
            <span className="trust-stat-num">60%</span>
            <div className="trust-stat-lbl">Faster contract review</div>
          </div>
          <div className="trust-stat">
            <span className="trust-stat-num">$1B+</span>
            <div className="trust-stat-lbl">Indian legaltech market by 2027</div>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        <strong>Disclaimer:</strong> All figures are estimates based on industry
        research and conservative assumptions. Actual results will vary
        depending on firm size, practice area, and individual usage patterns.
        LawInd does not guarantee any specific financial outcomes.
      </div>
    </>
  );
}

interface FirmResultData {
  totalProfit: number;
  lawyers: number;
  totalRev: number;
  totalSavedHrs: number;
  savedPerLawyer: number;
  totalBillHrs: number;
  revPerLawyer: number;
  nonBillHrs: number;
  savPct: number;
  convPct: number;
  margin: number;
  bT: number;
  bB: number;
  bA: number;
}

function FirmResults({
  r,
  fmt,
}: {
  r: FirmResultData;
  fmt: (n: number) => string;
}) {
  return (
    <>
      <div className="result-hero">
        <div className="result-hero-label">Total annual profit uplift</div>
        <div className="result-hero-amount">{fmt(r.totalProfit)}</div>
        <div className="result-hero-sub">
          Across {r.lawyers} fee earner{r.lawyers > 1 ? "s" : ""}
        </div>
        <div className="result-hero-chips">
          <div className="result-chip">
            <span className="result-chip-num">{fmt(r.totalRev)}</span>
            <div className="result-chip-lbl">New revenue per year</div>
          </div>
          <div className="result-chip">
            <span className="result-chip-num">
              {formatHours(r.totalSavedHrs)}
            </span>
            <div className="result-chip-lbl">Hours saved annually</div>
          </div>
          <div className="result-chip">
            <span className="result-chip-num">
              {Math.round(r.savedPerLawyer)} hrs
            </span>
            <div className="result-chip-lbl">Hrs saved / lawyer / yr</div>
          </div>
        </div>
      </div>

      <div className="result-card">
        <div className="result-card-head">Revenue breakdown</div>
        <div className="result-card-body">
          <div className="metrics-grid">
            <div className="metric-box accent">
              <div className="metric-box-lbl">New revenue</div>
              <div className="metric-box-val">{fmt(r.totalRev)}</div>
            </div>
            <div className="metric-box accent">
              <div className="metric-box-lbl">Incremental profit</div>
              <div className="metric-box-val">{fmt(r.totalProfit)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-box-lbl">New billable hours</div>
              <div className="metric-box-val">{formatHours(r.totalBillHrs)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-box-lbl">Hrs saved / lawyer / yr</div>
              <div className="metric-box-val">
                {Math.round(r.savedPerLawyer)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BarCard
        title="Where the time goes"
        bars={[
          {
            label: "AI savings on non-billable work",
            pct: Math.round(r.savPct * 100),
            width: r.bT,
            variant: "gold",
          },
          {
            label: "Recovered hours converted to billable",
            pct: Math.round(r.convPct * 100),
            width: r.bB,
            variant: "dark",
          },
          {
            label: "Profit margin on new revenue",
            pct: Math.round(r.margin * 100),
            width: r.bA,
            variant: "mid",
          },
        ]}
      />

      <SummaryCard
        title="Full year summary"
        rows={[
          ["Total non-billable hours", formatHours(r.nonBillHrs * r.lawyers)],
          ["Hours recovered by AI", formatHours(r.totalSavedHrs)],
          ["New billable hours (firm-wide)", formatHours(r.totalBillHrs)],
          ["New revenue per lawyer", fmt(r.revPerLawyer)],
          ["Total revenue uplift", fmt(r.totalRev)],
          ["Total incremental profit", fmt(r.totalProfit)],
        ]}
      />

      <CtaCard
        head="Ready to realise this ROI?"
        sub="See how LawInd fits your firm's specific workflow"
      />
    </>
  );
}

function InhouseResults({
  r,
  fmt,
}: {
  r: {
    totalSaving: number;
    lawyers: number;
    externalSaving: number;
    savedHrs: number;
    perLawyerMo: number;
    annualRoutine: number;
    internalSaving: number;
    savPct: number;
    shiftPct: number;
    bT: number;
    bB: number;
    bA: number;
  };
  fmt: (n: number) => string;
}) {
  return (
    <>
      <div className="result-hero">
        <div className="result-hero-label">Total annual savings</div>
        <div className="result-hero-amount">{fmt(r.totalSaving)}</div>
        <div className="result-hero-sub">
          Across {r.lawyers} in-house lawyer{r.lawyers > 1 ? "s" : ""}
        </div>
        <div className="result-hero-chips">
          <div className="result-chip">
            <span className="result-chip-num">{fmt(r.externalSaving)}</span>
            <div className="result-chip-lbl">External spend avoided</div>
          </div>
          <div className="result-chip">
            <span className="result-chip-num">{formatHours(r.savedHrs)}</span>
            <div className="result-chip-lbl">Hours freed annually</div>
          </div>
          <div className="result-chip">
            <span className="result-chip-num">
              {Math.round(r.perLawyerMo)} hrs
            </span>
            <div className="result-chip-lbl">Hrs freed / lawyer / mo</div>
          </div>
        </div>
      </div>

      <div className="result-card">
        <div className="result-card-head">Savings breakdown</div>
        <div className="result-card-body">
          <div className="metrics-grid">
            <div className="metric-box accent">
              <div className="metric-box-lbl">External spend avoided</div>
              <div className="metric-box-val">{fmt(r.externalSaving)}</div>
            </div>
            <div className="metric-box accent">
              <div className="metric-box-lbl">Internal time value</div>
              <div className="metric-box-val">{fmt(r.internalSaving)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-box-lbl">Routine hours / yr</div>
              <div className="metric-box-val">
                {Math.round(r.annualRoutine).toLocaleString()}
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-box-lbl">Hours saved by AI</div>
              <div className="metric-box-val">
                {Math.round(r.savedHrs).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BarCard
        title="Where savings come from"
        bars={[
          {
            label: "AI reduction in routine workload",
            pct: Math.round(r.savPct * 100),
            width: r.bT,
            variant: "gold",
          },
          {
            label: "Work shifted from external counsel",
            pct: Math.round(r.shiftPct * 100),
            width: r.bB,
            variant: "dark",
          },
          {
            label: "Internal time as % of total saving",
            pct: Math.round((r.internalSaving / r.totalSaving) * 100),
            width: r.bA,
            variant: "mid",
          },
        ]}
      />

      <SummaryCard
        title="Full year summary"
        rows={[
          ["Total routine hours per year", formatHours(r.annualRoutine)],
          ["Hours saved by AI", formatHours(r.savedHrs)],
          ["Internal time value recovered", fmt(r.internalSaving)],
          ["External counsel spend avoided", fmt(r.externalSaving)],
          ["Total annual saving", fmt(r.totalSaving)],
        ]}
      />

      <CtaCard
        head="Ready to realise these savings?"
        sub="See how LawInd works for your in-house team"
      />
    </>
  );
}

function BarCard({
  title,
  bars,
}: {
  title: string;
  bars: {
    label: string;
    pct: number;
    width: number;
    variant: "gold" | "dark" | "mid";
  }[];
}) {
  return (
    <div className="result-card">
      <div className="result-card-head">{title}</div>
      <div className="result-card-body bars-section">
        {bars.map((bar) => (
          <div key={bar.label} className="bar-row">
            <div className="bar-meta">
              <span className="bar-meta-label">{bar.label}</span>
              <span className="bar-meta-val">{bar.pct}%</span>
            </div>
            <div className="bar-track">
              <div
                className={`bar-fill bar-${bar.variant}`}
                style={{ width: `${bar.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  return (
    <div className="result-card">
      <div className="result-card-head">{title}</div>
      <div className="result-card-body">
        <table className="breakdown-table">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CtaCard({ head, sub }: { head: string; sub: string }) {
  return (
    <div className="cta-card">
      <div>
        <div className="cta-text-head">{head}</div>
        <div className="cta-text-sub">{sub}</div>
      </div>
      <Link href="/#contact" className="cta-btn">
        Request access →
      </Link>
    </div>
  );
}
