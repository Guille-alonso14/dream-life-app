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

const LIFESTYLE_LEVELS = {
  balanced:    { label: 'Equilibrado',  extra: 0,    icon: '🌿', description: 'Cómodo sin excesos' },
  comfortable: { label: 'Confortable',  extra: 500,  icon: '🛋️', description: 'Algún capricho mensual' },
  premium:     { label: 'Premium',      extra: 1500, icon: '💎', description: 'Lo mejor de todo' },
};

const EXTRAS = [
  { id: 'travel', label: 'Viajes', amount: 200, emoji: '✈️' },
  { id: 'training', label: 'Formación', amount: 100, emoji: '📚' },
  { id: 'restaurants', label: 'Restaurantes', amount: 150, emoji: '🍽️' },
  { id: 'culture', label: 'Cultura', amount: 80, emoji: '🎭' },
  { id: 'fashion', label: 'Moda', amount: 120, emoji: '👗' },
  { id: 'gym', label: 'Gimnasio', amount: 60, emoji: '🏋️' },
];

const fmt = (v: number) => '€' + Math.round(v).toLocaleString('es-ES');

function App() {
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [savingsPct, setSavingsPct] = useState(10);
  const [investPct, setInvestPct] = useState(5);
  const [lifestyle, setLifestyle] = useState<keyof typeof LIFESTYLE_LEVELS>('balanced');
  const [activeExtras, setActiveExtras] = useState<string[]>([]);

  const totalExpenses = Object.values(expenses).reduce((s, v) => s + v, 0);
  const lifestyleExtra = LIFESTYLE_LEVELS[lifestyle].extra;
  const extrasTotal = activeExtras.reduce((s, id) => {
    const e = EXTRAS.find(x => x.id === id);
    return s + (e?.amount ?? 0);
  }, 0);
  const base = totalExpenses + lifestyleExtra + extrasTotal;
  const totalPct = (savingsPct + investPct) / 100;
  const netNeeded = totalPct < 1 ? base / (1 - totalPct) : base * 2;
  const grossAnnual = (netNeeded * 12) / 0.75;

  const toggleExtra = (id: string) => {
    setActiveExtras(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

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

      {/* Estilo de vida */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Estilo de vida</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          {(Object.entries(LIFESTYLE_LEVELS) as any[]).map(([key, lvl]) => (
            <button
              key={key}
              onClick={() => setLifestyle(key)}
              style={{
                padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                border: lifestyle === key ? '2px solid #2a6049' : '1px solid #e0ddd6',
                background: lifestyle === key ? '#eaf4ef' : '#f7f5f0',
              }}
            >
              <div style={{ fontSize: 20 }}>{lvl.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{lvl.label}</div>
              <div style={{ fontSize: 11, color: '#a09d98' }}>{lvl.extra === 0 ? '—' : `+€${lvl.extra}`}</div>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 13, color: '#6b6760', marginBottom: 12 }}>Extras que quiero incluir</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EXTRAS.map((extra) => (
            <button
              key={extra.id}
              onClick={() => toggleExtra(extra.id)}
              style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
                border: activeExtras.includes(extra.id) ? '1px solid #2a6049' : '1px solid #e0ddd6',
                background: activeExtras.includes(extra.id) ? '#eaf4ef' : 'transparent',
                color: activeExtras.includes(extra.id) ? '#2a6049' : '#6b6760',
              }}
            >
              {extra.emoji} {extra.label} (+€{extra.amount})
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <div style={{ background: '#2a6049', borderRadius: 16, padding: 28, color: 'white', textAlign: 'center' }}>
        <p style={{ fontSize: 12, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Salario bruto anual necesario
        </p>
        <p style={{ fontSize: 48, fontFamily: 'Georgia, serif', marginBottom: 4 }}>
          {fmt(grossAnnual)}
        </p>
        <p style={{ opacity: 0.7 }}>{fmt(netNeeded)}/mes neto · {fmt(base)}/mes en gastos</p>
      </div>
    </div>
  );
}

export default App;