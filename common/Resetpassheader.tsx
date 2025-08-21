import { View, Text, Pressable, Image, Platform } from "react-native";
import React from "react";

export default function Resetpassheader({
  HeaderText = "Forgot your password?",
  SubHeaderText = "Enter the email address you signed up with below and we'll send you a code to help reset your password.",
}) {
  const MianImg = require("../assets/Images/Main logo.png");
  return (
    <View>
      <View className={`mx-auto items-center justify-center ${Platform.OS === "android"?"mt-[20%]":"mt-[5%]"}  `}>
        <Image source={MianImg} alt="main-imgg" />
        <Text className='text-[24px] leading-[32px] font-orelega text-center mt-[10px] text-[#2D2220]  '>
          {HeaderText}
        </Text>

        <Text className='text-[16px] leading-[25px] font-urbanist text-center  mt-[32px]  text-[#2D2220]  '>
          {SubHeaderText}
        </Text>
      </View>
    </View>
  );
}
