import { View, Text, ScrollView } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/common/ScreenWrapper";
import ProfileImg from "@/assets/svgs/ProfileImg.svg";
import OreAppText from "@/common/OreApptext";
import General from "@/components/AccountComps/General";
import MyAccountComps from "@/components/AccountComps/MyAccountComps";
import Finance from "@/components/AccountComps/Finance";
import Help from "@/components/AccountComps/Help";
import { useUserStore } from "@/store/useUserStore";

export default function Account() {
  const { user, fetchUser } = useUserStore();
  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  return (
    <ScreenWrapper>
      <View className="bg-[#346E5F] relative rounded-[4px] p-[24px] ">
        <View className="absolute">
          <ProfileImg />
        </View>

        <View className="mx-auto items-center">
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
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View className="mx-[16px]">
          <General />
          <MyAccountComps />
          <Finance />
          <Help />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
