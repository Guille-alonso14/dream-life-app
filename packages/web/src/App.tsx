import React, { useState } from 'react';

const DEFAULT_EXPENSES = {
  housing: 1200,
  food: 400,
  transport: 200,
  health: 100,
  leisure: 150,
  other: 200,
};

const LABELS: Record<string, string> = {
  housing: 'Vivienda',
  food: 'Alimentación',
  transport: 'Transporte',
  health: 'Salud y seguros',
  leisure: 'Ocio',
  other: 'Otros',
};

function App() {
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [savingsPct, setSavingsPct] = useState(10);
  const [investPct, setInvestPct] = useState(5);

  const totalExpenses = Object.values(expenses).reduce((s, v) => s + v, 0);
  const base = totalExpenses;
  const totalPct = (savingsPct + investPct) / 100;
  const netNeeded = totalPct < 1 ? base / (1 - totalPct) : base * 2;
  const grossAnnual = (netNeeded * 12) / 0.75;

  const fmt = (v: number) => '€' + Math.round(v).toLocaleString('es-ES');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Dream Life Calculator</h1>
      <p style={{ color: '#6b6760', marginBottom: 32 }}>Calcula el salario que necesitas para vivir tu mejor vida</p>

      {/* Gastos */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Gastos mensuales</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {Object.keys(expenses).map((key) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: '#a09d98', display: 'block', marginBottom: 4 }}>
                {LABELS[key]}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#a09d98' }}>€</span>
                <input
                  type="number"
                  value={expenses[key as keyof typeof expenses]}
                  onChange={(e) => setExpenses(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #e0ddd6', borderRadius: 8, fontSize: 15 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Objetivos financieros</h2>

        {[
          { label: 'Ahorro mensual', value: savingsPct, set: setSavingsPct, max: 40 },
          { label: 'Inversión mensual', value: investPct, set: setInvestPct, max: 30 },
        ].map(({ label, value, set, max }) => (
          <div key={label} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>{label}</span>
              <span style={{ fontWeight: 500, color: '#2a6049' }}>{value}%</span>
            </div>
            <input
              type="range" min={0} max={max} step={1} value={value}
              onChange={(e) => set(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>

      {/* Resultado */}
      <div style={{ background: '#2a6049', borderRadius: 16, padding: 28, color: 'white', textAlign: 'center' }}>
        <p style={{ fontSize: 12, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Salario bruto anual necesario
        </p>
        <p style={{ fontSize: 48, fontFamily: 'DM Serif Display', marginBottom: 4 }}>
          {fmt(grossAnnual)}
        </p>
        <p style={{ opacity: 0.7 }}>{fmt(netNeeded)}/mes neto · {fmt(totalExpenses)}/mes en gastos</p>
      </div>
    </div>
  );
}

export default App;