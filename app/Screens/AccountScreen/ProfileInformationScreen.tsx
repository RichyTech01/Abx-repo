import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import ScreenWrapper from "@/common/ScreenWrapper";
import Button from "@/common/Button";
import OreAppText from "@/common/OreApptext";
import EditProfileModals from "@/Modals/EditProfileModals";

export default function ProfileInformationScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <ScreenWrapper>
      <Header title="Profile information" />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white border border-[#F1EAE7] rounded-[16px] mx-[20px] py-[15px] px-[19.5px] mt-[32px]">
          <View className="gap-[16px]">
            <CustomTextInput
              label="Full name"
              value="Angela striving"
              editable={false}
            />
            <CustomTextInput
              label="Email Address"
              value="Angela striving"
              editable={false}
            />
            <CustomTextInput
              label="Phone number"
              value="Angela striving"
              editable={false}
            />
            <CustomTextInput
              label="Account type"
              value="Customer"
              editable={false}
            />
          </View>

          <View className="mt-[40px]">
            <Button
              title="Edit details"
              onPress={() => setShowModal((prev) => !prev)}
              paddingVertical={10}
              borderWidth={0}
            />
          </View>

          <View className="mt-[11%] h-[80px] justify-between">
            <OreAppText className="text-[16px] leading-[20px] text-[#2D2220]">
              Security
            </OreAppText>

            <View>
              <Button
                title="Change password"
                backgroundColor="#ECF1F0"
                borderWidth={0}
                textColor="#0C513F"
                onPress={() =>
                  router.push("/Screens/AccountScreen/ChangePasswordSCreen")
                }
                paddingVertical={10}
              />
            </View>
          </View>
        </View>

        <EditProfileModals
          visible={showModal}
          onClose={() => setShowModal((prev) => !prev)}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
