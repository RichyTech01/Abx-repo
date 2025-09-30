import {
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  Text,
} from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import ChatwithRepIcon from "@/assets/svgs/ChatRepIcon.svg";
import SendEmailIcon from "@/assets/svgs/SendEmailIcon.svg";
import CallIcon from "@/assets/svgs/CallIcon.svg";
import CopyIcon from "@/assets/svgs/CopyIcon.svg";
import * as Clipboard from "expo-clipboard";
import SupportCard from "@/common/SupportCard";
import { useRouter } from "expo-router";
import showToast from "@/utils/showToast";
import SupportApi from "@/api/SupportApi";
import { useState } from "react";
import ChatLoadingModal from "@/Modals/ChatLoadingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Support() {
  const router = useRouter();
  const [showLodaing, setShowLoading] = useState(false);

  const handleStartSession = async () => {
    setShowLoading(true);
    try {
      const response = await SupportApi.startChatSession();
      console.log("chat", response);
      await AsyncStorage.setItem("ChatSessionId", response.session_id);
      if (response.is_active === true) {
        router.push("/Screens/Support/ChatScreen");
        setShowLoading(false);
      } else {
        setShowLoading(false);
        showToast("error", "No support available. try again later");
      }
      return response;
    } catch (error: any) {
      console.error("Failed to start chat session:", error.response?.data);
    }
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:support@abx.com");
  };

  const handleCallPress = () => {
    Linking.openURL("tel:+442012345678");
  };

  const handleCopyNumber = async () => {
    await Clipboard.setStringAsync("+442012345678");
    showToast("success", "Copied ");
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
            <SupportCard
              icon={<ChatwithRepIcon />}
              title="Chat with a Rep"
              description="Need help? Visit our Support Center for quick answers and assistance."
              buttonText="Click to start a conversation"
              backgroundColor="#ECF1F0"
              buttonColor="#346E5F"
              onPress={handleStartSession}
            />

            {/* Send Email */}
            <SupportCard
              icon={<SendEmailIcon />}
              title="Send an email"
              description="Got a question? Email us, and we'll get back to you ASAP."
              buttonText="Click to start a conversation"
              backgroundColor="#FDF0DC"
              buttonColor="#F4B551"
              onPress={handleEmailPress}
            />

            <SupportCard
              icon={<CallIcon />}
              title="Call us"
              description="Need to talk? Give us a call on +442012345678 and we'll be happy to assist."
              buttonText="Click to start a conversation"
              backgroundColor="#FDE2F6"
              buttonColor="#FF97E4"
              onPress={handleCallPress}
              extraContent={
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={handleCopyNumber}
                >
                  <CopyIcon />
                  <Text className="text-[12px] font-urbanist-semibold text-[#424242] leading-[16px] ml-[8px]">
                    Copy number
                  </Text>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      </ScrollView>

      <ChatLoadingModal
        visible={showLodaing}
        onClose={() => setShowLoading(false)}
      />
    </ScreenWrapper>
  );
}
