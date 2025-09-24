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
import showToast from "@/utils/showToast";
import ScreenWrapper from "@/common/ScreenWrapper";
import { useUserStore } from "@/store/useUserStore";
import mqttClient from "@/utils/mqttClient";

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
    const { user, fetchUser } = useUserStore();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("error", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const res: SignInResponse = await AuthApi.signIn({ email, password });

      // Save tokens
      await AsyncStorage.setItem("accessToken", res.access);
      // await AsyncStorage.setItem("refreshToken", res.refresh);
      await AsyncStorage.setItem("isLoggedIn", "true");
      fetchUser()
      mqttClient.reconnect();

      // console.log("Login successful:", res);
      showToast("success", "Login successful! Welcome back.");
      router.dismissAll();

      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Login error:", err);

      if (err.response?.data?.detail) {
        showToast("error", err.response.data.detail);
      } else {
        showToast("error", "Check your credentials");
      }
    } finally {
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
              onChangeText={setEmail}
            />

            <View className="mt-[24px]">
              <CustomTextInput
                label="Password"
                isPassword
                placeholder="Use a minimum of 7 characters"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Pressable
              className="mt-[16px]"
              onPress={() => router.push("/ForgotPasswordScreen")}
            >
              <Text className="text-[#0C513F] font-urbanist-semibold text-[14px] leading-[20px]">
                Forgot password?
              </Text>
            </Pressable>

            <View className="mt-[8%]">
              <Button title={"Login"} loading={loading} onPress={handleLogin} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
