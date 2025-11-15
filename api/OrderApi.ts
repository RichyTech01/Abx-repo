import ApiService from "./apiService";
import { ChangeOrderStatus, Address } from "@/types/Order";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddToCartRequest } from "@/types/carts";

export interface AddAddressPayload {
  addr: string;
  post_code: string;
  city: string;
  is_guest?: boolean;
  full_name?: string;
}

export interface AddressResponse {
  id?: string;
  addr?: string;
  post_code?: string;
  city?: string;
  is_guest?: boolean;
  full_name?: string;
  [key: string]: any;
}

class OrderApi {
  private client = ApiService.getClient();

  public async addToCart(payload: {
    product_id: number;
  }): Promise<AddToCartRequest> {
    const res = await this.client.post("/order/add-to-cart", payload);

    if (res.data.cart_id) {
      await AsyncStorage.setItem("cartId", res.data.cart_id.toString());
    }

    return res.data;
  }

  // ✅ Get cart details
  public async getCart() {
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
  ): Promise<any> {
    const res = await this.client.patch(
      `/order/${item_id}/update-cart`,
      payload
    );
    return res.data;
  }

  // ✅ Checkout (get summary)
  public async checkout(): Promise<any> {
    try {
      const res = await this.client.get("/order/checkout");
      return res.data;
      console.log("error", res.data);
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  }

  public async getMyAddress(): Promise<Address> {
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

  public async getCustomerAddresses(page?: number) {
    try {
      const res = await this.client.get("/customer/addresses", {
        params: page ? { page } : {},
      });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch customer addresses:", error);
      throw error;
    }
  }

  public async addAddress(
    payload: AddAddressPayload
  ): Promise<AddressResponse> {
    const res = await this.client.post("/customer/add-address", payload);
    return res.data;
  }

  public async initiatePayment(payload: { total_price: number }): Promise<any> {
    try {
      const res = await this.client.post("/payment/initiate-payment", payload);
      return res.data;
    } catch (error: any) {
      console.error("Initiate payment error:", error.response?.data || error);
      throw error;
    }
  }

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

  public async getCustomerOrders(params?: {
    is_completed?: boolean;
    page?: number;
  }) {
    try {
      const res = await this.client.get("/customer/orders", {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
      throw error;
    }
  }

  public async getCustomerOrderById(id: string) {
    try {
      const res = await this.client.get(`/customer/orders/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch customer order with id ${id}:`, error);
      throw error;
    }
  }

  public async completeCustomerOrder(orderId: string) {
    try {
      const res = await this.client.patch(
        `/customer/orders/${orderId}/complete`
      );
      return res.data;
    } catch (error) {
      console.error(`Failed to complete order ${orderId}:`, error);
      throw error;
    }
  }

  public async setDefaultCustomerAddress(addressId: string) {
    try {
      const res = await this.client.patch(
        `/customer/${addressId}/set-default-address`
      );
      return res.data;
    } catch (error: any) {
      console.error(
        `Failed to set default address (ID: ${addressId}):`,
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async editCustomerAddress(
    addressId: string,
    payload: {
      addr?: string;
      post_code?: string;
      city?: string;
      is_guest?: boolean;
    }
  ) {
    try {
      const res = await this.client.patch(
        `/customer/${addressId}/edit-address`,
        payload
      );
      return res.data;
    } catch (error) {
      console.error(`Failed to edit address (ID: ${addressId}):`, error);
      throw error;
    }
  }

  public async createProductReview(
    productId: number,
    rating: number,
    comment: string
  ): Promise<any> {
    try {
      const payload = {
        product: productId,
        rating,
        comment,
      };

      const res = await this.client.post("/customer/product/review", payload);

      return res.data;
    } catch (error: any) {
      console.error(
        "Error creating product review:",
        error.response || error.message
      );
      throw error;
    }
  }
}

export default new OrderApi();
