import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import OreAppText from "@/common/OreApptext";
import ArrowRIght from "@/assets/svgs/ArrowRight.svg";
import SpendingInsightIcon from "@/assets/svgs/SpendingInsightIcon.svg";
import { useProtectedNavigation } from "@/hooks/useProtectedNavigation";
import LogoutModal from "@/Modals/LogoutModal";
import Storage from "@/utils/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Finance() {
  const { showModal, setShowModal, handleProtectedNavigation } =
    useProtectedNavigation();
  const router = useRouter();

  return (
    <View>
      <OreAppText className="text-[#2D2220] text-[16px] leading-[20px]  my-[16px] ">
        Finance
      </OreAppText>

      <View className="border border-[#F1EAE7] rounded-[8px] py-[10px] px-[8px] bg-white ">
        <TouchableOpacity
          className="py-[4px] pl-[4px] flex-row items-center justify-between "
          onPress={() =>
            handleProtectedNavigation(
              "/Screens/AccountScreen/SpendingBudgetScreen"
            )
          }
        >
          <View className="flex-row items-center ">
            <SpendingInsightIcon />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Spending Insight
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>
      </View>
      <LogoutModal
        visible={showModal}
        onClose={() => setShowModal((prev) => !prev)}
        title="Login Required"
        message="Sorry! you have to login to access this screen"
        confirmText="Login"
        cancelText="Cancel"
        onConfirm={async () => {
          await Storage.multiRemove(["isGuest"]);

          await AsyncStorage.setItem("redirectAfterLogin", "/(tabs)/Account");

          router.replace("/Login");
        }}
      />
    </View>
  );
}
