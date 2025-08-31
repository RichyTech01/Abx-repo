import { View, Text, Pressable } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CancelModalIcon from "@/assets/svgs/CancelModalIcon.svg";
import UrbanistText from "@/common/UrbanistText";

export default function PrivacyAndPolicyScreen() {
  return (
    <ScreenWrapper>
      <Header title="Our privacy policy" />

      <View className="bg-white mt-[24px] rounded-[16px] px-[22px] pb-[28px] pt-[14px] mx-[16px] ">
        <Pressable className=" items-end ">
          <CancelModalIcon />
        </Pressable>

        <View className="mt-[18px]  ">
          <UrbanistText className="text-[#2D2220] text-[16px] leading-[22px]  ">
            At ABX, we are committed to protecting your privacy and ensuring the
            security of your personal information. All conversations held within
            this chat are end-to-end encrypted. This means only you and the
            person you're communicating with can read the messages—no one else,
            not even ABX.
          </UrbanistText>

          <UrbanistText className="text-[#2D2220] text-[16px] leading-[22px] mt-4">
            We do not store your conversations beyond what is necessary to
            support your experience, and any data collected is handled in
            accordance with our strict privacy standards and relevant data
            protection laws.
          </UrbanistText>
        </View>
      </View>
    </ScreenWrapper>
  );
}
