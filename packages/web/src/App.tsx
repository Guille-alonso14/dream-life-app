import React, { useState, useEffect } from 'react';
import { initAuth, saveScenario, subscribeScenarios, deleteScenario } from './firebase';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f7f5f0; color: #1a1814; -webkit-font-smoothing: antialiased; }
  h1, h2, h3 { font-family: 'DM Serif Display', Georgia, serif; font-weight: 400; }
  input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; background: #e0ddd6; outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #2a6049; cursor: pointer; box-shadow: 0 0 0 3px #eaf4ef; }
  input[type=range]:hover::-webkit-slider-thumb { box-shadow: 0 0 0 5px #d0e9df; }
  button { font-family: 'DM Sans', sans-serif; }
`;

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
  const [uid, setUid] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [scenarioName, setScenarioName] = useState('');
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    initAuth((userId) => {
      setUid(userId);
      subscribeScenarios(userId, setScenarios);
    });
  }, []);

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

  const chartData = [
    { name: 'Gastos fijos', value: Math.round(totalExpenses), color: '#2a6049' },
    { name: 'Estilo de vida', value: Math.round(lifestyleExtra + extrasTotal), color: '#b07d3a' },
    { name: 'Ahorro', value: Math.round(netNeeded * savingsPct / 100), color: '#6ba88a' },
    { name: 'Inversión', value: Math.round(netNeeded * investPct / 100), color: '#7b6fca' },
  ].filter(d => d.value > 0);

  const toggleExtra = (id: string) => {
    setActiveExtras(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  async function handleSave() {
    if (!uid || !scenarioName.trim()) return;
    await saveScenario(uid, scenarioName, {
      expenses, savingsPct, investPct, lifestyle, activeExtras,
      grossAnnual: Math.round(grossAnnual),
      netNeeded: Math.round(netNeeded),
    });
    setScenarioName('');
    setShowSave(false);
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem' }}>
      <style>{globalStyle}</style>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>Dream Life Calculator</h1>
        <p style={{ color: '#6b6760', fontSize: 16, fontWeight: 300 }}>
          Calcula el salario que necesitas para vivir tu mejor vida
        </p>
      </div>

      {/* Gastos */}
      <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Gastos mensuales</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {Object.keys(expenses).map((key) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: '#a09d98', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {LABELS[key]}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#a09d98', fontSize: 14 }}>€</span>
                <input
                  type="number"
                  value={expenses[key as keyof typeof expenses]}
                  onChange={(e) => setExpenses(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  style={{
                    width: '100%', padding: '10px 10px 10px 24px',
                    border: '1px solid #e8e5e0', borderRadius: 10,
                    fontSize: 15, color: '#1a1814', background: '#f7f5f0', outline: 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 24 }}>Objetivos financieros</h2>
        {[
          { label: 'Ahorro mensual', value: savingsPct, set: setSavingsPct, max: 40, sub: fmt(netNeeded * savingsPct / 100) + '/mes' },
          { label: 'Inversión mensual', value: investPct, set: setInvestPct, max: 30, sub: fmt(netNeeded * investPct / 100) + '/mes' },
        ].map(({ label, value, set, max, sub }) => (
          <div key={label} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 15 }}>{label}</span>
                <span style={{ fontSize: 12, color: '#a09d98', marginLeft: 8 }}>{sub}</span>
              </div>
              <span style={{ fontWeight: 500, color: '#2a6049', fontSize: 16 }}>{value}%</span>
            </div>
            <input
              type="range" min={0} max={max} step={1} value={value}
              onChange={(e) => set(Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      {/* Estilo de vida */}
      <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Estilo de vida</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
          {(Object.entries(LIFESTYLE_LEVELS) as any[]).map(([key, lvl]) => (
            <button
              key={key}
              onClick={() => setLifestyle(key)}
              style={{
                padding: '16px 12px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                border: lifestyle === key ? '2px solid #2a6049' : '1px solid #e8e5e0',
                background: lifestyle === key ? '#eaf4ef' : '#f7f5f0',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{lvl.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 13, color: '#1a1814', marginBottom: 2 }}>{lvl.label}</div>
              <div style={{ fontSize: 11, color: '#a09d98' }}>{lvl.extra === 0 ? 'Sin extra' : `+€${lvl.extra}/mes`}</div>
              <div style={{ fontSize: 10, color: '#6b6760', marginTop: 4 }}>{lvl.description}</div>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 13, color: '#6b6760', marginBottom: 12, fontWeight: 500 }}>Extras que quiero incluir</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EXTRAS.map((extra) => (
            <button
              key={extra.id}
              onClick={() => toggleExtra(extra.id)}
              style={{
                padding: '7px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer',
                border: activeExtras.includes(extra.id) ? '1px solid #2a6049' : '1px solid #e8e5e0',
                background: activeExtras.includes(extra.id) ? '#eaf4ef' : 'transparent',
                color: activeExtras.includes(extra.id) ? '#2a6049' : '#6b6760',
                transition: 'all 0.15s',
              }}
            >
              {extra.emoji} {extra.label} <span style={{ opacity: 0.6 }}>+€{extra.amount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <div style={{ background: '#2a6049', borderRadius: 20, padding: 36, color: 'white', textAlign: 'center', marginBottom: 20, boxShadow: '0 4px 20px rgba(42,96,73,0.25)' }}>
        <p style={{ fontSize: 11, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Salario bruto anual necesario
        </p>
        <p style={{ fontSize: 52, fontFamily: 'DM Serif Display, Georgia, serif', marginBottom: 8, letterSpacing: '-0.02em' }}>
          {fmt(grossAnnual)}
        </p>
        <p style={{ opacity: 0.7, fontSize: 15, marginBottom: 24 }}>
          {fmt(netNeeded)}/mes neto · {fmt(base)}/mes en gastos
        </p>
        <button
          onClick={() => setShowSave(true)}
          style={{
            padding: '12px 28px', borderRadius: 999,
            background: 'white', color: '#2a6049', border: 'none',
            fontWeight: 500, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          Guardar escenario →
        </button>
      </div>

      {/* Gráfica */}
      <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 20, marginBottom: 24 }}>Distribución del salario neto</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => fmt(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {chartData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#6b6760' }}>{item.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{fmt(item.value)}/mes</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal guardar */}
      {showSave && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 36, width: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Guardar escenario</h2>
            <p style={{ color: '#6b6760', fontSize: 14, marginBottom: 20 }}>Ponle un nombre para identificarlo después</p>
            <input
              type="text"
              placeholder="Ej: Vida en Madrid sin coche"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
              style={{
                width: '100%', padding: '12px 16px',
                border: '1px solid #e8e5e0', borderRadius: 12,
                fontSize: 15, marginBottom: 16, outline: 'none',
                color: '#1a1814', background: '#f7f5f0',
              }}
            />
            <div style={{ background: '#eaf4ef', borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 14, color: '#6b6760' }}>Bruto anual necesario</span>
              <strong style={{ fontSize: 20, color: '#2a6049' }}>{fmt(grossAnnual)}</strong>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSave(false)}
                style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #e8e5e0', background: 'transparent', cursor: 'pointer', fontSize: 14, color: '#6b6760' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!scenarioName.trim()}
                style={{
                  padding: '10px 24px', borderRadius: 10, border: 'none',
                  background: scenarioName.trim() ? '#2a6049' : '#e8e5e0',
                  color: scenarioName.trim() ? 'white' : '#a09d98',
                  fontWeight: 500, cursor: scenarioName.trim() ? 'pointer' : 'not-allowed', fontSize: 14,
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de escenarios */}
      {scenarios.length > 0 && (
        <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 20, marginBottom: 20 }}>Escenarios guardados</h2>
          {scenarios.map((s) => (
            <div key={s.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 0', borderBottom: '1px solid #f0ede8',
            }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 3 }}>{s.name}</div>
                <div style={{ fontSize: 13, color: '#6b6760' }}>
                  {fmt(s.grossAnnual)}/año · {fmt(s.netNeeded)}/mes neto
                </div>
              </div>
              <button
                onClick={() => uid && deleteScenario(uid, s.id)}
                style={{ background: 'transparent', border: 'none', color: '#a09d98', cursor: 'pointer', fontSize: 13 }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;