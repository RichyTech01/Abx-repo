import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import ChatwithRepIcon from "@/assets/svgs/ChatRepIcon.svg";
import SendEmailIcon from "@/assets/svgs/SendEmailIcon.svg";
import CallIcon from "@/assets/svgs/CallIcon.svg";

export default function Support() {
  const handleEmailPress = () => {
    Linking.openURL("mailto:support@abx.com"); 
  };

  const handleCallPress = () => {
    Linking.openURL("tel:+442012345678");
  };

  return (
    <ScreenWrapper>
      <OreAppText className="text-[#2D2220] text-[20px] leading-[28px] mt-2 mx-auto">
        Customer support
      </OreAppText>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-[20px] mt-[24px]">
          <UrbanistText className="text-[16px] leading-[22px] text-center mx-auto text-[#2D2220]">
            At ABX, we are committed to ensuring that all your needs are met
            with efficiency, care, and professionalism. Our dedicated support
            team is always ready to answer your questions, provide technical
            guidance, or personalized solutions.
          </UrbanistText>

          <View className="mt-[22px] gap-[16px]">
            {/* Chat with Rep */}
            <TouchableOpacity className="bg-[#ECF1F0] rounded-[8px] py-[13px] w-full items-center">
              <View className="w-[70%] items-center">
                <ChatwithRepIcon />
                <OreAppText className="text-[16px] leading-[20px] text-[#2C2C2C] mt-[16px]">
                  Chat with a Rep
                </OreAppText>
                <UrbanistText className="text-[#424242] text-[14px] leading-[20px] text-center mt-[8px]">
                  Need help? Visit our Support Center for quick answers and
                  assistance.
                </UrbanistText>
              </View>
            </TouchableOpacity>

            {/* Send Email */}
            <TouchableOpacity
              onPress={handleEmailPress}
              className="bg-[#FDF0DC] rounded-[8px] py-[13px] w-full items-center"
            >
              <View className="w-[70%] items-center">
                <SendEmailIcon />
                <OreAppText className="text-[16px] leading-[20px] text-[#2C2C2C] mt-[16px]">
                  Send an email
                </OreAppText>
                <UrbanistText className="text-[#424242] text-[14px] leading-[20px] text-center mt-[8px]">
                  Got a question? Email us, and we'll get back to you ASAP
                </UrbanistText>
              </View>
            </TouchableOpacity>

            {/* Call Us */}
            <TouchableOpacity
              onPress={handleCallPress}
              className="bg-[#FDE2F6] rounded-[8px] py-[13px] w-full items-center"
            >
              <View className="w-[70%] items-center">
                <CallIcon />
                <OreAppText className="text-[16px] leading-[20px] text-[#2C2C2C] mt-[16px]">
                  Call us
                </OreAppText>
                <UrbanistText className="text-[#424242] text-[14px] leading-[20px] text-center mt-[8px]">
                  Need to talk? Give us a call on +442012345678 and we'll be
                  happy to assist.
                </UrbanistText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
