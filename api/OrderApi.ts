import ApiService from "./apiService";
import {
  Cart,
  CartItem,
} from "@/types/Order";

class OrderApi {
  private client = ApiService.getClient();

  // Add item to cart
  public async addToCart(payload: {
    product_variation_id: number;
    quantity: number;
    cart_id?: string;
  }): Promise<CartItem> {
    const res = await this.client.post("/order/add-to-cart", payload);
    return res.data;
  }

  // Get cart details
  public async getCart(): Promise<Cart> {
    const res = await this.client.get("/order/cart");
    return res.data.cart;
  }

  // Remove item from cart
  public async removeFromCart(cartItemId: number): Promise<void> {
    await this.client.delete(`/order/${cartItemId}/remove-from-cart`);
  }

  // Update item in cart
  public async updateCart(
    cartItemId: number,
    payload: { action: "increase" | "decrease" }
  ): Promise<CartItem> {
    const res = await this.client.patch(
      `/order/${cartItemId}/update-cart`,
      payload
    );
    return res.data;
  }

  // Clear all items from cart (optional helper)
  public async clearCart(): Promise<void> {
    const cart = await this.getCart();
    await Promise.all(cart.items.map((item) => this.removeFromCart(item.id)));
  }

  // Checkout
  public async checkout(): Promise<any> {
    const res = await this.client.get("/order/checkout");
    return res.data;
  }

  // Change order status
  public async changeOrderStatus(id: string, data: any) {
    const res = await this.client.put(`/order/${id}/change-status`, data);
    return res.data;
  }

  public async changeOrderStatusPartial(
    id: string,
    data: Partial<any>
  ) {
    const res = await this.client.patch(`/order/${id}/change-status`, data);
    return res.data;
  }
}

export default new OrderApi();
