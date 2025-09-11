import { create } from "zustand";

type BudgetStore = {
  budgetAmount: string | null;
  budgetId: string | null;
  setBudget: (amount: string, id: string) => void;
};

export const useBudgetStore = create<BudgetStore>((set) => ({
  budgetAmount: null,
  budgetId: null,
  setBudget: (amount, id) => set({ budgetAmount: amount, budgetId: id }),
}));
