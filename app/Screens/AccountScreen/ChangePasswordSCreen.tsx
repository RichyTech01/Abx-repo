import { View, ScrollView } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";

export default function ChangePasswordSCreen() {
  return (
    <ScreenWrapper>
      <Header title="Change password" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white border border-[#F1EAE7] rounded-[16px] mt-[10%] py-[30.5px] px-[20px] mx-[20px]">
          <View className="gap-[16px]">
            <CustomTextInput
              label="Current password"
              placeholder="Password field"
              isPassword
            />
            <CustomTextInput
              label="New password"
              placeholder="Password field"
              isPassword
            />
            <CustomTextInput
              label="Confirm new password"
              placeholder="Password field"
              isPassword
            />
          </View>

          <View className="mt-[40px]">
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
