import ApiService from "./apiService";

class OrderApi {
  private client = ApiService.getClient();

  //  Add item to cart
  public async addToCart(data: any) {
    const res = await this.client.post("/api/order/add-to-cart", data);
    return res.data;
  }

  //  Get cart details
  public async getCart() {
    const res = await this.client.get("/api/order/cart");
    return res.data;
  }

  //  Remove item from cart
  public async removeFromCart(itemId: number) {
    const res = await this.client.delete(`/api/order/${itemId}/remove-from-cart`);
    return res.data; // 204 (No content) → may return nothing
  }

  //  Update item in cart
  public async updateCart(itemId: number, data: any) {
    const res = await this.client.patch(`/api/order/${itemId}/update-cart`, data);
    return res.data;
  }

  //  Checkout (start checkout process)
  public async checkout() {
    const res = await this.client.get("/api/order/checkout");
    return res.data;
  }

  //  Change order status (PUT)
  public async changeOrderStatus(id: string, data: any) {
    const res = await this.client.put(`/api/order/${id}/change-status`, data);
    return res.data;
  }

  //  Change order status (PATCH - partial update)
  public async changeOrderStatusPartial(id: string, data: any) {
    const res = await this.client.patch(`/api/order/${id}/change-status`, data);
    return res.data;
  }
}

export default new OrderApi();
