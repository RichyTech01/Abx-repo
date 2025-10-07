import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import ArrowRIght from "@/assets/svgs/ArrowRight.svg";
import ProfileImg from "@/assets/svgs/ProfileImg.svg";
import OreAppText from "@/common/OreApptext";
import General from "@/components/AccountComps/General";
import MyAccountComps from "@/components/AccountComps/MyAccountComps";
import Finance from "@/components/AccountComps/Finance";
import Help from "@/components/AccountComps/Help";
import { useUserStore } from "@/store/useUserStore";
import LogoutIcon from "@/assets/svgs/LogOutIcon.svg";
import LogoutModal from "@/Modals/LogoutModal";
import { useRouter } from "expo-router";
import { logoutUser } from "@/utils/logoutUser";
import Storage from "@/utils/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Account() {
  const [showModal, setShowModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const router = useRouter();

  const { user, fetchUser } = useUserStore();
  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  useEffect(() => {
    const checkToken = async () => {
      const token = await Storage.get("accessToken");
      setHasToken(!!token);
    };
    checkToken();
  }, []);

  return (
    <ScreenWrapper>
      <View className="bg-[#346E5F] relative rounded-[4px] p-[24px] ">
        <View className="absolute">
          <ProfileImg />
        </View>

        <View className="mx-auto items-center  ">
          <View className="bg-[#ECF1F0] h-[30px] w-[30px] rounded-full items-center justify-center">
            <Text className="text-[14px] leading-[20px] text-[#2D2220] font-urbanist-medium">
              {user?.first_name?.charAt(0).toUpperCase() || "G"}
            </Text>
          </View>

          <OreAppText className="text-[14px] leading-[20px] text-white mt-[8px]">
            {user?.first_name || "Guest"} {user?.last_name || "Guest"}
          </OreAppText>
          <OreAppText className="text-[14px] leading-[20px] text-white mt-[2px]">
            {user?.email}
          </OreAppText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 110 : 160,
        }}
      >
        <View className="mx-[16px]">
          <General />
          <MyAccountComps />
          <Finance />
          <Help />

          <View className="border border-[#F1EAE7] rounded-[8px] py-[8px] px-[8px] bg-white  mt-[16px] ">
            <TouchableOpacity
              className="py-[4px] pl-[4px] flex-row items-center justify-between "
              onPress={async () => {
                if (hasToken) {
                  setShowModal(true);
                } else {
                  await AsyncStorage.multiRemove([
                    "isGuest",
                    "cartId",
                  ]);

                  router.replace("/onboarding");
                }
              }}
            >
              <View className="flex-row items-center ">
                <LogoutIcon />
                <Text className="font-urbanist-medium text-[#F04438] text-[16px] leading-[22px] ml-[8px]  ">
                  {hasToken ? "Log out" : "Log in"}
                </Text>
              </View>
              <ArrowRIght />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <LogoutModal
        visible={showModal}
        onClose={() => setShowModal((prev) => !prev)}
        title="Log out"
        message="Are you sure you want to log out of your account?"
        confirmText="Yes, Log out"
        cancelText="No, Cancel"
        onConfirm={() => logoutUser(router)}
      />
    </ScreenWrapper>
  );
}
