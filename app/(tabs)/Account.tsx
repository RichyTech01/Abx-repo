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

export default function Account() {
  const [showModal, setShowModal] = useState(false);

  const { user, fetchUser } = useUserStore();
  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  return (
    <ScreenWrapper>
      <View className="bg-[#346E5F] relative rounded-[4px] p-[24px] ">
        <View className="absolute">
          <ProfileImg />
        </View>

        <View className="mx-auto items-center  ">
          <View className="bg-[#ECF1F0] h-[30px] w-[30px] rounded-full items-center justify-center">
            <Text className="text-[14px] leading-[20px] text-[#2D2220] font-urbanist-medium">
              {user?.first_name?.charAt(0).toUpperCase()}
            </Text>
          </View>

          <OreAppText className="text-[14px] leading-[20px] text-white mt-[8px]">
            {user?.first_name} {user?.last_name}
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
              onPress={() => setShowModal((prev) => !prev)}
            >
              <View className="flex-row items-center ">
                <LogoutIcon />
                <Text className="font-urbanist-medium text-[#F04438] text-[16px] leading-[22px] ml-[8px]  ">
                  Log out
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
      />
    </ScreenWrapper>
  );
}
