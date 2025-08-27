import ApiService from "./apiService";
import { Cart, CartItem, AddToCartData, UpdateCartData, OrderStatusData } from "@/types/Order";

class OrderApi {
  private client = ApiService.getClient();

  // Add item to cart
  public async addToCart(data: AddToCartData): Promise<CartItem> {
    const res = await this.client.post("/api/order/add-to-cart", data);
    return res.data;
  }

  // Get cart details
  public async getCart(): Promise<Cart> {
    const res = await this.client.get("/api/order/cart");
    return res.data;
  }

  // Remove item from cart
  public async removeFromCart(itemId: number): Promise<void> {
    await this.client.delete(`/api/order/${itemId}/remove-from-cart`);
  }

  // Update item in cart
  public async updateCart(itemId: number, data: UpdateCartData): Promise<CartItem> {
    const res = await this.client.patch(`/api/order/${itemId}/update-cart`, data);
    return res.data;
  }

  // Clear all items from cart (optional helper)
  public async clearCart(): Promise<void> {
    const cart = await this.getCart();
    await Promise.all(cart.items.map(item => this.removeFromCart(item.id)));
  }

  // Checkout
  public async checkout(): Promise<any> {
    const res = await this.client.get("/api/order/checkout");
    return res.data;
  }

  // Change order status
  public async changeOrderStatus(id: string, data: OrderStatusData) {
    const res = await this.client.put(`/api/order/${id}/change-status`, data);
    return res.data;
  }

  public async changeOrderStatusPartial(id: string, data: Partial<OrderStatusData>) {
    const res = await this.client.patch(`/api/order/${id}/change-status`, data);
    return res.data;
  }
}


export default new OrderApi();
