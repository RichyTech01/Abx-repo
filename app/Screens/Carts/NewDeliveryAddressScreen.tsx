import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useState } from "react";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import OreAppText from "@/common/OreApptext";
import Button from "@/common/Button";
import Toggle from "@/common/Toggle";
import CustomPhoneInput from "@/common/PhoneNumberInput";

export default function NewDeliveryAddressScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [rawPhoneNumber, setRawPhoneNumber] = useState("");

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView className="flex-1 bg-[#FFF6F2]">
      <View style={{ paddingTop: statusBarHeight }}>
        <Header title="New delivery address" />
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white p-[16px] mx-[20px] mt-[40px] rounded-[8px]">
          <View className="gap-[18px]">
            {isEnabled && (
              <View className="gap-[18px]">
                <CustomTextInput
                  label="Recipient's full name"
                  placeholder="John Thriving"
                />

                <CustomPhoneInput
                  value={rawPhoneNumber}
                  onChange={(phone) => setRawPhoneNumber(phone)}
                />
              </View>
            )}
            <CustomTextInput
              label="Post code"
              placeholder="Type your post code"
            />
            <CustomTextInput label="City" placeholder="Type your post code" />
            <CustomTextInput
              label="Home Address"
              placeholder="Clearly state your address"
            />
          </View>

          <View className="mt-[24px]">
            <View className="flex-row items-center justify-between">
              <OreAppText className="text-[#424242] text-[14px] leading-[20px]">
                Want to shop for someone else?
              </OreAppText>
              <Toggle value={isEnabled} onValueChange={setIsEnabled} />
            </View>

            <View className="mt-[24px]">
              <Button
                title="Add Address"
                textColor="#0C513F"
                backgroundColor="#ECF1F0"
                borderColor="#AEC5BF"
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
