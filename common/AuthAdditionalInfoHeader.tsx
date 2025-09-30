import { View, Text, Image } from "react-native";
import React from "react";

export default function AuthAdditionalInfoHeader() {
  const MianImg = require("../assets/Images/Main logo.png");

  return (
    <View>
      <View className={`mx-auto items-center justify-center mt-[5%] `}>
        <Image source={MianImg} />

        <Text className="text-[24px] leading-[32px] font-orelega text-[#2D2220] mt-[10px]">
          {"Create your account"}
        </Text>

        <View className="flex-row mt-[7%] items-center mx-[20px] ">
          <Text className="font-urbanist-semibold text-[#2D2220] text-[16px] leading-[22px] text-center ">
            {"Provide additional information to complete your registration"}
          </Text>
        </View>
      </View>
    </View>
  );
}
