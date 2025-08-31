import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import OreAppText from "@/common/OreApptext";
import ChangePAssIcon from "@/assets/svgs/ChangePasswordIcon.svg";
import ArrowRIght from "@/assets/svgs/ArrowRight.svg";
import PersonalInfo from "@/assets/svgs/PersonalInfo.svg";
import AddressIcon from "@/assets/svgs/Address.Icon.svg";
import RateThisAppIcon from "@/assets/svgs/RateThisApp.svg"
import PrivacyAndPolicyIcon from "@/assets/svgs/PrivacyAndPolicy.svg"

export default function Help() {

  const router = useRouter()

  return (
    <View>
      <OreAppText className="text-[#2D2220] text-[16px] leading-[20px]  my-[16px] ">
       Help
      </OreAppText>

      <View className="border border-[#F1EAE7] rounded-[8px] py-[10px px-[8px] bg-white ">
        <TouchableOpacity className="py-[10px] pl-[4px] border-b border-[#F1EAE7] flex-row items-center justify-between ">
          <View className="flex-row items-center ">
            <PersonalInfo />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Contact us
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>

        <TouchableOpacity className="py-[10px] pl-[4px] border-b border-[#F1EAE7] flex-row items-center justify-between " onPress={() => router.push("/Screens/AccountScreen/PrivacyAndPolicyScreen")}>
          <View className="flex-row items-center ">
            <PrivacyAndPolicyIcon />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Privacy policy
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>

        <TouchableOpacity className="py-[10px] pl-[4px] flex-row items-center justify-between ">
          <View className="flex-row items-center ">
            <RateThisAppIcon />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Rate the app
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>
      </View>
    </View>
  );
}
