"use client";

import { useMemo, useState } from "react";
import { calcEstimate, EstimateInput, formatCurrency, METALS } from "@/lib/pricing";

const defaultValues: EstimateInput = {
  itemType: "Custom Ring",
  metal: "18ct",
  goldPricePerGram: 160,
  metalPurityFactor: 0.75,
  weightGrams: 7,
  stoneCost: 1200,
  labourCost: 350,
  settingCost: 180,
  rhodiumCost: 60,
  miscCost: 50,
  markup: 2.5,
  fingerSize: "M",
  notes: "Natural diamond centre with clean Cartmer client wording."
};

export default function EstimatorApp() {
  const [form, setForm] = useState<EstimateInput>(defaultValues);
  const [staffMode, setStaffMode] = useState(true);

  const estimate = useMemo(() => calcEstimate(form), [form]);

  function update<K extends keyof EstimateInput>(key: K, value: EstimateInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateMetal(nextMetal: string) {
    const selected = METALS.find((m) => m.value === nextMetal);
    setForm((prev) => ({
      ...prev,
      metal: nextMetal,
      metalPurityFactor: selected?.purity ?? prev.metalPurityFactor
    }));
  }

  const clientSummary = `${form.itemType} in ${form.metal.toUpperCase()}${form.fingerSize ? `, finger size ${form.fingerSize}` : ""}. Includes selected stones and workshop finishing. Final quoted price ${formatCurrency(estimate.sellPrice)}.`;

  return (
    <div className="page">
      <div className="shell">
        <div className="header">
          <div className="brand">
            <h1>CARTMER ESTIMATOR</h1>
            <p>Private pricing tool for staff quotes, custom jobs, repairs, and quick workshop estimates.</p>
          </div>
          <div className="badge">Custom markup slider enabled</div>
        </div>

        <div className="grid">
          <section className="card">
            <h2 className="section-title">Quote builder</h2>
            <div className="form-grid">
              <div className="field">
                <label>Item type</label>
                <input value={form.itemType} onChange={(e) => update("itemType", e.target.value)} />
              </div>
              <div className="field">
                <label>Finger size</label>
                <input value={form.fingerSize} onChange={(e) => update("fingerSize", e.target.value)} />
              </div>

              <div className="field">
                <label>Metal</label>
                <select value={form.metal} onChange={(e) => updateMetal(e.target.value)}>
                  {METALS.map((metal) => (
                    <option key={metal.value} value={metal.value}>{metal.label}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Live gold price per gram</label>
                <input type="number" value={form.goldPricePerGram} onChange={(e) => update("goldPricePerGram", Number(e.target.value))} />
              </div>

              <div className="field">
                <label>Estimated weight (g)</label>
                <input type="number" step="0.1" value={form.weightGrams} onChange={(e) => update("weightGrams", Number(e.target.value))} />
              </div>
              <div className="field">
                <label>Stone cost</label>
                <input type="number" value={form.stoneCost} onChange={(e) => update("stoneCost", Number(e.target.value))} />
              </div>

              <div className="field">
                <label>Labour</label>
                <input type="number" value={form.labourCost} onChange={(e) => update("labourCost", Number(e.target.value))} />
              </div>
              <div className="field">
                <label>Setting</label>
                <input type="number" value={form.settingCost} onChange={(e) => update("settingCost", Number(e.target.value))} />
              </div>

              <div className="field">
                <label>Rhodium / finish</label>
                <input type="number" value={form.rhodiumCost} onChange={(e) => update("rhodiumCost", Number(e.target.value))} />
              </div>
              <div className="field">
                <label>Misc costs</label>
                <input type="number" value={form.miscCost} onChange={(e) => update("miscCost", Number(e.target.value))} />
              </div>

              <div className="field full">
                <label>Markup slider: {form.markup.toFixed(2)}x</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.05"
                  value={form.markup}
                  onChange={(e) => update("markup", Number(e.target.value))}
                />
                <div className="help">Use this instead of fixed 2x / 2.5x / 3x presets. Fine control from 1.00x to 5.00x.</div>
              </div>

              <div className="field full">
                <label>Notes</label>
                <textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
              </div>
            </div>

            <div className="actions">
              <button className="button primary" type="button">Save quote</button>
              <button className="button secondary" type="button" onClick={() => setStaffMode((v) => !v)}>
                Switch to {staffMode ? "client" : "staff"} view
              </button>
            </div>

            <div className="note">
              Next version: save to database, generate PDF quote, and push approved jobs into Shopify draft orders.
            </div>
          </section>

          <aside className="card">
            <h2 className="section-title">Live result</h2>
            <div className="kpis">
              <div className="kpi">
                <span>Sell price</span>
                <strong>{formatCurrency(estimate.sellPrice)}</strong>
              </div>
              <div className="kpi">
                <span>Gross profit</span>
                <strong>{formatCurrency(estimate.grossProfit)}</strong>
              </div>
              <div className="kpi">
                <span>Total cost</span>
                <strong>{formatCurrency(estimate.totalCost)}</strong>
              </div>
              <div className="kpi">
                <span>Margin</span>
                <strong>{estimate.marginPercent.toFixed(1)}%</strong>
              </div>
            </div>

            {staffMode ? (
              <div className="quote-box">
                <h3>Staff breakdown</h3>
                <div className="list">
                  <div className="row"><span>Metal cost</span><strong>{formatCurrency(estimate.metalCost)}</strong></div>
                  <div className="row"><span>Stone cost</span><strong>{formatCurrency(form.stoneCost)}</strong></div>
                  <div className="row"><span>Labour</span><strong>{formatCurrency(form.labourCost)}</strong></div>
                  <div className="row"><span>Setting</span><strong>{formatCurrency(form.settingCost)}</strong></div>
                  <div className="row"><span>Rhodium / finish</span><strong>{formatCurrency(form.rhodiumCost)}</strong></div>
                  <div className="row"><span>Misc</span><strong>{formatCurrency(form.miscCost)}</strong></div>
                  <div className="row"><span>Markup used</span><strong>{form.markup.toFixed(2)}x</strong></div>
                </div>
              </div>
            ) : (
              <div className="quote-box">
                <h3>Client summary</h3>
                <p>{clientSummary}</p>
                <p><strong>Total quoted price: {formatCurrency(estimate.sellPrice)}</strong></p>
                <p>{form.notes}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
