import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import OreAppText from "@/common/OreApptext";
import ChangePAssIcon from "@/assets/svgs/ChangePasswordIcon.svg";
import ArrowRIght from "@/assets/svgs/ArrowRight.svg";
import PersonalInfo from "@/assets/svgs/PersonalInfo.svg";
import AddressIcon from "@/assets/svgs/Address.Icon.svg";
import LogoutModal from "@/Modals/LogoutModal";
import { useProtectedNavigation } from "@/hooks/useProtectedNavigation";
import Storage from "@/utils/Storage";

export default function MyAccountComps() {
  const { showModal, setShowModal, handleProtectedNavigation } =
    useProtectedNavigation();

  const router = useRouter();

  return (
    <View>
      <OreAppText className="text-[#2D2220] text-[16px] leading-[20px]  my-[16px] ">
        My account
      </OreAppText>

      <View className="border border-[#F1EAE7] rounded-[8px] py-[10px px-[8px] bg-white ">
        <TouchableOpacity
          className="py-[10px] pl-[4px] border-b border-[#F1EAE7] flex-row items-center justify-between "
          onPress={() =>
            handleProtectedNavigation(
              "/Screens/AccountScreen/ProfileInformationScreen"
            )
          }
        >
          <View className="flex-row items-center ">
            <PersonalInfo />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Personal information
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>

        <TouchableOpacity
          className="py-[10px] pl-[4px] border-b border-[#F1EAE7] flex-row items-center justify-between "
          onPress={() =>
            handleProtectedNavigation(
              "/Screens/AccountScreen/ChangeAddressScreen"
            )
          }
        >
          <View className="flex-row items-center ">
            <AddressIcon />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Address
            </Text>
          </View>
          <ArrowRIght />
        </TouchableOpacity>

        <TouchableOpacity
          className="py-[10px] pl-[4px] flex-row items-center justify-between "
          onPress={() =>
            handleProtectedNavigation(
              "/Screens/AccountScreen/ChangePasswordSCreen"
            )
          }
        >
          <View className="flex-row items-center ">
            <ChangePAssIcon />
            <Text className="font-urbanist-medium text-[#2D2220] text-[14px] leading-[20px] ml-[8px]  ">
              Change password
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
          await Storage.multiRemove(["isGuest", "cartId"]);
          router.replace("/Login");
        }}
      />
    </View>
  );
}
