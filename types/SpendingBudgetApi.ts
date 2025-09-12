export type SpendingBudgetRequest = {
  amount: string;
  start_date: string;
  month: number;
  year: number;
};

export type SpendingBudgetResponse = {
  id: string;
  year: number;
  month: number;
  amount: string;
  amount_spent: string ;
  balance: string;
  percent_used: number;
  transactions: any[];
  total_spent: string;
  start_date?: string; 
};

export type SpendingInsightResponse = {
  amount: string;
  amount_spent?: string; 
  balance: string;
  percent_used: number;
  total_spent: string;
  transactions: any[];
  month: number;
  year: number;
  id?: string;
  start_date?: string;
};


