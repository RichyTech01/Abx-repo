import ApiService from "./apiService";
import Constants from "expo-constants";
import axios from "axios";

const { GET_ADDRESS_API_KEY } = Constants.expoConfig?.extra || {};
const ADDRESS_BASE_URL = "https://api.getAddress.io";

// console.log("API Key:", GET_ADDRESS_API_KEY);

class AuthApi {
  private client = ApiService.getClient();

  // Sign up
  public async signUp(data: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    user_address: {
      addr: string;
      post_code: string;
      city: string;
    };
    password: string;
  }) {
    const res = await this.client.post("/auth/sign-up", data);
    return res.data;
  }

  // Verify email using OTP
  public async verifyEmail(data: { otp: string }) {
    const res = await this.client.post("/auth/verify-email", data);
    return res.data;
  }

  // Sign in
  public async signIn(data: { email: string; password: string }) {
    const res = await this.client.post("/auth/sign-in", data);
    return res.data;
  }


  public async changePassword(data: {
    current_password: string;
    new_password: string;
    confirm_new_password: string;
  }) {
    try {
      const res = await this.client.patch("/auth/change-password", data);
      return res.data;
    } catch (error: any) {
      console.error("Change password error:", error.response || error.message);
      throw error;
    }
  }

  // Forgot password
  public async forgotPassword(email: string) {
    const res = await this.client.post("/auth/forget-password", { email });
    return res.data;
  }

  // update Profile
   public async setNewProfile(data: {
    first_name: string;
    last_name: string;
    phone_number: string;
  }) {
    const res = await this.client.patch("/auth/me/update", data);
    return res.data;
  }

  // Reset password after OTP
  public async setNewPassword(data: {
    email: string;
    token: string;
    new_password: string;
  }) {
    const res = await this.client.patch("/auth/set-new-password", data);
    return res.data;
  }

  // Confirm reset code
  public async confirmResetCode(data: { email: string; otp_code: string }) {
    const res = await this.client.post(
      "/auth/password-reset-code-confirm",
      data
    );
    return res.data;
  }

  // Resend OTP
  public async resendOtp(email: string) {
    const res = await this.client.post("/auth/resend-otp", { email });
    return res.data;
  }

  // Google sign-in
  public async googleSignIn(data: { token: string }) {
    const res = await this.client.post("/auth/google/sign-in/", data);
    return res.data;
  }

  // Get current authenticated user
  public async getMe() {
    const res = await this.client.get("/auth/me");
    return res.data;
  }

  // Create store
  public async createStore(formData: FormData) {
    const res = await this.client.post("/auth/create-store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  // Stripe onboarding
  public async stripeOnboarding() {
    const res = await this.client.post("/auth/stripe-onboarding");
    return res.data;
  }

  // Validate email or phone before registration
  public async validateCredential(data: { email?: string; phone?: string }) {
    const res = await this.client.post("/auth/validated-credential", data);
    return res.data;
  }

  // Update Google user phone number
  public async updatePhoneNumber(data: { phone_number: string }) {
    const res = await this.client.patch("/auth/update-user-phone_number", data);
    return res.data;
  }

  public async autocomplete(term: string) {
    const res = await axios.get(
      `${ADDRESS_BASE_URL}/autocomplete/${term}?api-key=${GET_ADDRESS_API_KEY}`
    );
    return res.data.suggestions;
  }
}

export default new AuthApi();
