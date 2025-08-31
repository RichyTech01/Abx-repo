import { View, ScrollView } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";

export default function ChangeAddressScreen() {
  return (
    <ScreenWrapper>
      <Header title="Change address" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white py-[16px] px-[24px] mt-[10%] mx-[24px]">
          <View className="gap-[16px]">
            <CustomTextInput
              label="Post code"
              placeholder="Type your post code"
            />
            <CustomTextInput
              label="City"
              placeholder="Please select a region"
            />
            <CustomTextInput
              label="Home Address"
              placeholder="Clearly state your address"
            />
          </View>

          <View className="mt-[16px]">
            <Button
              title="Save changes"
              onPress={() => {}}
              paddingVertical={10}
              borderWidth={0}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
