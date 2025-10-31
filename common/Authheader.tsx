import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import GoogleAuth from "./GoogleAuth";

type Props = {
  name?: "Create account" | "Login";
  Subtext?: string;
  HeaderText?: string;
  googleSignName?: string;
};

export default function Authheader({
  name = "Create account",
  Subtext = "Don't have an account?",
  HeaderText = "Welcome back to ABX!",
  googleSignName = "Sign in",
}: Props) {
  const router = useRouter();
  const MianImg = require("../assets/Images/abx-icon.png");

  const handlePress = () => {
    if (name === "Create account") {
      router.push("/createAccountSteps/CreateAccount" as never);
    } else {
      router.push("/Login" as never);
    }
  };

  return (
    <View>
      <View className={`mx-auto items-center justify-center mt-[5%]`}>
        <Image
          source={MianImg}
          style={{ width: 60, height: 60, resizeMode: "contain" }}
          className="rounded-[12px]"
        />

        <Text className="text-[24px] leading-[32px] font-orelega text-[#2D2220] mt-[10px]">
          {HeaderText}
        </Text>

        <View className="flex-row mt-[8px] items-center">
          <Text className="font-urbanist-semibold text-[16px] leading-[22px]">
            {Subtext}
          </Text>

          <Pressable onPress={handlePress}>
            <Text className="text-[#0C513F] text-[16px] font-urbanist-semibold ml-[4px]">
              {name}
            </Text>
          </Pressable>
        </View>
      </View>

      <GoogleAuth />
    </View>
  );
}
