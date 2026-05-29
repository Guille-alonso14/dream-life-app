import type { Expenses, FinancialGoals, LifestyleLevel, ComputedResult } from '../types';

// ─── Constantes ───────────────────────────────────────────────────────────────

export const LIFESTYLE_EXTRAS = [
  { id: 'travel_basic', label: 'Viajes', amount: 200, emoji: '✈️' },
  { id: 'travel_premium', label: 'Viajes premium', amount: 300, emoji: '🌍' },
  { id: 'training', label: 'Formación', amount: 100, emoji: '📚' },
  { id: 'restaurants', label: 'Restaurantes', amount: 150, emoji: '🍽️' },
  { id: 'culture', label: 'Cultura y eventos', amount: 80, emoji: '🎭' },
  { id: 'fashion', label: 'Moda y ropa', amount: 120, emoji: '👗' },
  { id: 'gym', label: 'Gimnasio', amount: 60, emoji: '🏋️' },
  { id: 'getaways', label: 'Escapadas', amount: 250, emoji: '🧳' },
];

export const LIFESTYLE_LEVELS = {
  balanced:    { label: 'Equilibrado',  extra: 0,    icon: '🌿', description: 'Cómodo sin excesos' },
  comfortable: { label: 'Confortable',  extra: 500,  icon: '🛋️', description: 'Algún capricho mensual' },
  premium:     { label: 'Premium',      extra: 1500, icon: '💎', description: 'Lo mejor de todo' },
};

// Retención IRPF media España ~25%
export const IRPF_RETENTION = 0.25;

// ─── Valores por defecto ──────────────────────────────────────────────────────

export const DEFAULT_EXPENSES: Expenses = {
  housing: 1200,
  food: 400,
  transport: 200,
  health: 100,
  leisure: 150,
  other: 200,
};

export const DEFAULT_GOALS: FinancialGoals = {
  savingsPct: 10,
  investPct: 5,
  emergencyMonths: 3,
};

// ─── Calculadora ──────────────────────────────────────────────────────────────

export function computeResult(
  expenses: Expenses,
  goals: FinancialGoals,
  lifestyleLevel: LifestyleLevel,
  activeExtraIds: string[]
): ComputedResult {
  const baseExpenses = Object.values(expenses).reduce((s, v) => s + (v || 0), 0);

  const lifestyleLevelExtra = LIFESTYLE_LEVELS[lifestyleLevel].extra;
  const tagExtra = activeExtraIds.reduce((sum, id) => {
    const extra = LIFESTYLE_EXTRAS.find((e) => e.id === id);
    return sum + (extra?.amount ?? 0);
  }, 0);
  const lifestyleTotal = lifestyleLevelExtra + tagExtra;

  const base = baseExpenses + lifestyleTotal;
  const totalPct = (goals.savingsPct + goals.investPct) / 100;
  const netNeeded = totalPct < 1 ? base / (1 - totalPct) : base * 2;

  const savingsEur = netNeeded * (goals.savingsPct / 100);
  const investEur = netNeeded * (goals.investPct / 100);
  const grossAnnual = (netNeeded * 12) / (1 - IRPF_RETENTION);

  const emergencyTarget = baseExpenses * goals.emergencyMonths;
  const monthsToEmergency = savingsEur > 0 ? Math.ceil(emergencyTarget / savingsEur) : null;

  return {
    totalExpenses: Math.round(baseExpenses + lifestyleTotal),
    lifestyleTotal: Math.round(lifestyleTotal),
    netNeeded: Math.round(netNeeded),
    grossAnnual: Math.round(grossAnnual),
    savingsEur: Math.round(savingsEur),
    investEur: Math.round(investEur),
    emergencyTarget: Math.round(emergencyTarget),
    monthsToEmergency,
  };
}

// ─── Formateadores ────────────────────────────────────────────────────────────

export const fmt = (v: number) =>
  '€' + Math.round(v).toLocaleString('es-ES');

export const fmtK = (v: number) => {
  if (v >= 1000) return '€' + (Math.round(v / 100) / 10).toLocaleString('es-ES') + 'k';
  return fmt(v);
};