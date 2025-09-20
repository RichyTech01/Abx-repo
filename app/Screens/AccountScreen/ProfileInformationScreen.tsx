import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import ScreenWrapper from "@/common/ScreenWrapper";
import Button from "@/common/Button";
import OreAppText from "@/common/OreApptext";
import { useUserStore } from "@/store/useUserStore";
import EditProfileInformationModal from "@/Modals/EditProfileInformationModal";

export default function ProfileInformationScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  const handleModalClose = () => {
    setShowModal(false);
    if (user) {
      fetchUser();
    }
  };

  const UserType = user?.is_vendor === true ? "Vendor" : "Customer";

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
              value={`${user?.first_name ?? ""} ${
                user?.last_name ?? ""
              }`.trim()}
              editable={false}
            />
            <CustomTextInput
              label="Email Address"
              value={user?.email}
              editable={false}
            />
            <CustomTextInput
              label="Phone number"
              value={user?.phone_number}
              editable={false}
            />
            <CustomTextInput
              label="Account type"
              value={UserType}
              editable={false}
            />
          </View>

          <View className="mt-[40px]">
            <Button
              title="Edit details"
              onPress={() => setShowModal(true)}
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
      </ScrollView>

      <EditProfileInformationModal
        visible={showModal}
        onClose={handleModalClose}
      />
    </ScreenWrapper>
  );
}
