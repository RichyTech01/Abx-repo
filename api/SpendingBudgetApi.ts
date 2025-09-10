// SpendingBudgetApi.ts
import ApiService from "./apiService";

export type SpendingBudgetResponse = {
  id?: string;
  year: number | null;
  month: number | null;
  amount: string | null;
  amount_spent: string | null;
  balance?: string | null;
  percent_used?: number | null;
  transactions?: any;
};

export type SpendingInsightResponse = {
  message?: string;
};

class SpendingBudgetApi {
  private client = ApiService.getClient();

  public async getCurrentSpendingBudget(): Promise<SpendingBudgetResponse> {
    try {
      const res = await this.client.get("/order/spending-budget/current");
      return res.data;
    } catch (error: any) {
      console.error(
        "Error fetching current spending budget:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async getSpendingInsights(): Promise<SpendingInsightResponse> {
    try {
      const res = await this.client.get("/order/budget/spending-insights");
      return res.data;
    } catch (error: any) {
      console.error(
        "Error fetching spending insights:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export default new SpendingBudgetApi();
