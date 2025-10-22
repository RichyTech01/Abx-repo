import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Authheader from "@/common/Authheader";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import { useRouter } from "expo-router";
import AuthApi from "@/api/AuthApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "@/common/ScreenWrapper";
import { useUserStore } from "@/store/useUserStore";

interface SignInResponse {
  access: string;
  refresh: string;
  is_first_login: boolean;
  is_vendor: boolean;
  id: string;
  is_staff: boolean;
  is_admin: boolean;
  is_verified: boolean;
}

export default function Login() {
  const { fetchUser } = useUserStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleLogin = async () => {
    // Clear previous errors
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    // If there are validation errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const res: SignInResponse = await AuthApi.signIn({ email, password });

      // Save tokens
      await AsyncStorage.multiSet([
        ["accessToken", res.access],
        ["isLoggedIn", "true"],
      ]);

      fetchUser();
      router.dismissAll();
      router.replace("/(tabs)");

      setErrors({});
    } catch (err: any) {
      console.log("Login error:", err);
      console.log("Full error response:", err.response?.data);

      const backendErrors = err.response?.data || {};
      const fieldErrors: typeof errors = {};

      // Handle field-specific errors from backend
      if (backendErrors.email) {
        fieldErrors.email = Array.isArray(backendErrors.email)
          ? backendErrors.email[0]
          : backendErrors.email;
        console.log("Email error set:", fieldErrors.email);
      }
      if (backendErrors.password) {
        fieldErrors.password = Array.isArray(backendErrors.password)
          ? backendErrors.password[0]
          : backendErrors.password;
        console.log("Password error set:", fieldErrors.password);
      }

      // Handle non-field errors (like invalid credentials)
      if (backendErrors.non_field_errors) {
        const errorMessage = Array.isArray(backendErrors.non_field_errors)
          ? backendErrors.non_field_errors[0]
          : backendErrors.non_field_errors;

        // Try to determine if it's an email or password issue based on error message
        const errorLower = errorMessage.toLowerCase();
        if (errorLower.includes("email") || errorLower.includes("username")) {
          fieldErrors.email = errorMessage;
          console.log("Non-field error set to email:", fieldErrors.email);
        } else if (
          errorLower.includes("password") ||
          errorLower.includes("pass")
        ) {
          fieldErrors.password = errorMessage;
          console.log("Non-field error set to password:", fieldErrors.password);
        } else {
          // For generic messages, show under both fields
          fieldErrors.email = errorMessage;
          fieldErrors.password = errorMessage;
          console.log("Non-field error set to both fields:", errorMessage);
        }
      }
      // Debug: Log field errors before setting
      console.log("Field errors to set:", fieldErrors);

      // Always set errors to show them in the form
      setErrors(fieldErrors);
      console.log("Setting field errors:", fieldErrors);
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Authheader />

          <View className="mx-[20px] mt-[8%] justify-center">
            <CustomTextInput
              label="Email Address"
              placeholder="Type your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              error={errors.email}
            />

            <View className="mt-[24px]">
              <CustomTextInput
                label="Password"
                isPassword
                placeholder="Use a minimum of 7 characters"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                error={errors.password}
              />
            </View>

            <Pressable
              className="mt-[16px] self-start"
              onPress={() => router.push("/ForgotPasswordScreen")}
            >
              <Text className="text-[#0C513F] font-urbanist-semibold text-[14px] leading-[20px]">
                Forgot password?
              </Text>
            </Pressable>

            <View className="mt-[8%]">
              <Button
                title={"Login"}
                loading={loading}
                disabled={loading}
                onPress={handleLogin}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
