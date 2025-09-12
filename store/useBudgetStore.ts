import { create } from "zustand";
import { SpendingBudgetResponse } from "@/types/SpendingBudgetApi";

type BudgetStore = {
  budgetAmount: string | null;
  budgetId: string | null;
  budget: SpendingBudgetResponse | null;
  setBudget: (amount: string, id: string, budget?: SpendingBudgetResponse) => void;
};

export const useBudgetStore = create<BudgetStore>((set) => ({
  budgetAmount: null,
  budgetId: null,
  budget: null,
  setBudget: (amount, id, budget) =>
    set({ budgetAmount: amount, budgetId: id, budget: budget ?? null }),
}));
