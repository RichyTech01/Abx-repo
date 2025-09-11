export type SpendingBudgetRequest = {
  amount: string;
  start_date: string;
  month: number;
  year: number;
};

// Response when fetching/creating a budget
export type SpendingBudgetResponse = {
  id: string;
  year: number;
  month: number;
  amount: string;
  amount_spent: string ;
  balance: string;
  percent_used: number;
  transactions: any[];
  start_date?: string; // optional, sometimes returned
};

// Response for insights endpoint
export type SpendingInsightResponse =
  | { message: string } // when no budget set
  | {
      year: number;
      month: number;
      amount: string;
      total_spent: string;
      balance: string;
      percent_used: number;
      transactions: any[];
    };
