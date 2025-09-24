import ApiService from "./apiService";
import {
  SpendingBudgetRequest,
  SpendingBudgetResponse,
  SpendingInsightResponse,
} from "@/types/SpendingBudgetApi";

class SpendingBudgetApi {
  private client = ApiService.getClient();

  //  Get current spending budget
  public async getCurrentSpendingBudget(): Promise<SpendingBudgetResponse> {
    const res = await this.client.get("/order/spending-budget/current");
    return res.data;
  }

  // Get spending insights
  public async getSpendingInsights(): Promise<SpendingInsightResponse> {
    const res = await this.client.get("/order/budget/spending-insights");
    return res.data;
  }

  // Create monthly budget
  public async setSpendingBudget(
    payload: SpendingBudgetRequest
  ): Promise<SpendingBudgetResponse> {
    const res = await this.client.post("/order/set-spending-budget", payload);
    return res.data;
  }

  public async updateSpendingBudget(
  id: string,
  payload: SpendingBudgetRequest
): Promise<SpendingBudgetResponse> {
  const res = await this.client.patch(`/order/spending-budget/${id}`, payload);
  return res.data;
}

}

export default new SpendingBudgetApi();
