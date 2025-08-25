import ApiService from "./apiService";

class AdminApi {
  private client = ApiService.getClient();

  // --------------------
  // Products
  // --------------------
  public async getAllProducts(page?: number, search?: string) {
    const res = await this.client.get("/api/admin/all-products", {
      params: { page, search },
    });
    return res.data;
  }

  // --------------------
  // Orders
  // --------------------
  public async getOrders(params: {
    page?: number;
    search?: string;
    start_date?: string;
    end_date?: string;
    is_order_completed?: boolean;
  }) {
    const res = await this.client.get("/api/admin/orders", { params });
    return res.data;
  }

  public async getOrderById(id: string) {
    const res = await this.client.get(`/api/admin/orders/${id}`);
    return res.data;
  }

  public async getNewDeliveryOrders(page?: number) {
    const res = await this.client.get("/api/admin/delivery/new-orders", {
      params: { page },
    });
    return res.data;
  }

  public async assignRider(orderId: string, payload: any) {
    const res = await this.client.patch(
      `/api/admin/delivery/${orderId}/assign-rider`,
      payload
    );
    return res.data;
  }

  // -------------------
  // Categories
  // -------------------
  public async getCategories(page?: number) {
    const res = await this.client.get("/admin/product/categories", {
      params: { page },
    });
    return res.data;
  }

  public async createCategory(payload: any) {
    const res = await this.client.post(
      "/api/admin/product/categories",
      payload
    );
    return res.data;
  }

  public async getCategoryById(id: number) {
    const res = await this.client.get(`/api/admin/product/categories/${id}/`);
    return res.data;
  }

  public async updateCategory(id: number, payload: any) {
    const res = await this.client.put(
      `/api/admin/product/categories/${id}/`,
      payload
    );
    return res.data;
  }

  public async deleteCategory(id: number) {
    const res = await this.client.delete(
      `/api/admin/product/categories/${id}/`
    );
    return res.data;
  }

  // --------------------
  // Reports & Dashboard
  // --------------------
  public async getDashboardMetrics() {
    const res = await this.client.get("/api/admin/dashboard-metrics");
    return res.data;
  }

  public async getDashboardOrdersMetric() {
    const res = await this.client.get("/api/admin/dashboard-orders-metric");
    return res.data;
  }

  public async getDashboardVendorMetric() {
    const res = await this.client.get("/api/admin/dashboard-vendor-metric");
    return res.data;
  }

  public async getMonthlyProfitChart() {
    const res = await this.client.get(
      "/api/admin/reports/monthly-profit-chart"
    );
    return res.data;
  }

  public async getMonthlyRevenueChart() {
    const res = await this.client.get(
      "/api/admin/reports/monthly-revenue-chart"
    );
    return res.data;
  }

  public async getMonthlySales() {
    const res = await this.client.get("/api/admin/reports/monthly-sales");
    return res.data;
  }

  public async getProductMetrics() {
    const res = await this.client.get("/api/admin/reports/product-metrics");
    return res.data;
  }

  public async getRevenueMetric() {
    const res = await this.client.get("/api/admin/reports/revenu-metric");
    return res.data;
  }

  public async getRevenueBreakdown(params: {
    page?: number;
    search?: string;
    start_date?: string;
    end_date?: string;
    is_order_completed?: boolean;
  }) {
    const res = await this.client.get("/api/admin/reports/revenue-breakdown", {
      params,
    });
    return res.data;
  }
}

export default new AdminApi();
