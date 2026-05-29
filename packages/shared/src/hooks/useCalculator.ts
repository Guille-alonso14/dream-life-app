import { useState, useCallback, useMemo } from 'react';
import { computeResult, DEFAULT_EXPENSES, DEFAULT_GOALS } from '../utils/calculator';
import type { Expenses, FinancialGoals, LifestyleLevel } from '../types';

export function useCalculator() {
  const [expenses, setExpenses] = useState<Expenses>(DEFAULT_EXPENSES);
  const [goals, setGoals] = useState<FinancialGoals>(DEFAULT_GOALS);
  const [lifestyleLevel, setLifestyleLevel] = useState<LifestyleLevel>('balanced');
  const [activeExtraIds, setActiveExtraIds] = useState<string[]>([]);

  // Se recalcula automáticamente cada vez que cambia cualquier valor
  const result = useMemo(
    () => computeResult(expenses, goals, lifestyleLevel, activeExtraIds),
    [expenses, goals, lifestyleLevel, activeExtraIds]
  );

  const setExpenseField = useCallback((field: keyof Expenses, value: number) => {
    setExpenses((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setGoalField = useCallback((field: keyof FinancialGoals, value: number) => {
    setGoals((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleExtra = useCallback((id: string) => {
    setActiveExtraIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const reset = useCallback(() => {
    setExpenses(DEFAULT_EXPENSES);
    setGoals(DEFAULT_GOALS);
    setLifestyleLevel('balanced');
    setActiveExtraIds([]);
  }, []);

  return {
    expenses,
    goals,
    lifestyleLevel,
    activeExtraIds,
    result,
    setExpenseField,
    setGoalField,
    setLifestyleLevel,
    toggleExtra,
    reset,
  };
}