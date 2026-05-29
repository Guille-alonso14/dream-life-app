export interface Expenses {
  housing: number;
  food: number;
  transport: number;
  health: number;
  leisure: number;
  other: number;
}

export type LifestyleLevel = 'balanced' | 'comfortable' | 'premium';

export interface FinancialGoals {
  savingsPct: number;
  investPct: number;
  emergencyMonths: number;
}

export interface Scenario {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  expenses: Expenses;
  goals: FinancialGoals;
  lifestyleLevel: LifestyleLevel;
  lifestyleExtras: string[];
  computed: ComputedResult;
}

export interface ComputedResult {
  totalExpenses: number;
  lifestyleTotal: number;
  netNeeded: number;
  grossAnnual: number;
  savingsEur: number;
  investEur: number;
  emergencyTarget: number;
  monthsToEmergency: number | null;
}