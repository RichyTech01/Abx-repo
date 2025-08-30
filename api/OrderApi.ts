import ApiService from "./apiService";
import { Cart, CartItem, ChangeOrderStatus } from "@/types/Order";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AddAddressPayload {
  addr: string;
  post_code: string;
  city: string;
  is_guest: boolean;
  full_name?: string; // required if the API complains like in your 400 example
}

export interface AddressResponse {
  id?: string;
  addr?: string;
  post_code?: string;
  city?: string;
  is_guest?: boolean;
  full_name?: string;
  [key: string]: any; // for any extra props returned
}

class OrderApi {
  private client = ApiService.getClient();

  // ✅ Add item to cart - Accepts product_id as per backend requirement
  public async addToCart(payload: { product_id: number }): Promise<CartItem> {
    const res = await this.client.post("/order/add-to-cart", payload);

    if (res.data.cart_id) {
      await AsyncStorage.setItem("cartId", res.data.cart_id.toString());
    }

    return res.data;
  }

  // ✅ Get cart details
  public async getCart(): Promise<Cart> {
    const res = await this.client.get("/order/cart");
    return res.data;
  }

  // ✅ Remove item from cart
  public async removeFromCart(item_id: number): Promise<void> {
    await this.client.delete(`/order/${item_id}/remove-from-cart`);
  }

  public async updateCart(
    item_id: number,
    payload: { action: "increase" | "decrease" } | { quantity: number }
  ): Promise<CartItem> {
    const res = await this.client.patch(
      `/order/${item_id}/update-cart`,
      payload
    );
    return res.data;
  }

  // ✅ Checkout (get summary)
  public async checkout(): Promise<any> {
    try {
      const res = await this.client.get("/order/checkout"); // or get, depending on API
      return res.data;
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  }

  public async getMyAddress(): Promise<any> {
    try {
      const res = await this.client.get("/customer/my-address");
      return res.data; 
    } catch (error: any) {
      console.error(
        "Error fetching user address:",
        error.response || error.message
      );
      throw error;
    }
  }
   
  public async addAddress(payload: AddAddressPayload): Promise<AddressResponse> {
    const res = await this.client.post("/customer/add-address", payload);
    return res.data;
  }

  public async initiatePayment(): Promise<any> {
    try {
      const res = await this.client.post("/payment/initiate-payment");
      return res.data;
    } catch (error) {
      console.error("Initiate payment error:", error);
      throw error;
    }
  }

  // ✅ Change order status (PUT)
  public async changeOrderStatus(
    id: string,
    payload: ChangeOrderStatus
  ): Promise<ChangeOrderStatus> {
    const res = await this.client.put(`/order/${id}/change-status`, payload);
    return res.data;
  }

  public async patchOrderStatus(
    id: string,
    payload: Partial<ChangeOrderStatus>
  ): Promise<ChangeOrderStatus> {
    const res = await this.client.patch(`/order/${id}/change-status`, payload);
    return res.data;
  }
}

export default new OrderApi();
