import { View, ScrollView, Text } from "react-native";
import { useEffect, useState, useMemo } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import { useUserStore } from "@/store/useUserStore";
import ChangeAddressModal from "@/Modals/ChangeAddressModal";

export default function ChangeAddressScreen() {
  const { user, fetchUser } = useUserStore();
  const [showModal, setShowModal] = useState(false);

  // get default address
  const defaultAddress = useMemo(() => {
    if (user?.address?.length) {
      return (
        user.address.find((addr: any) => addr.default_addr) || user.address[0]
      );
    }
    return null;
  }, [user]);

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  return (
    <ScreenWrapper>
      <Header title="My Address" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white py-[16px] px-[24px] mt-[10%] mx-[24px] rounded-lg">
          <View className="gap-[16px]">
            <Text className="font-urbanist-semibold text-[16px] leading-[22px] text-[#2D2220]  ">
              Default Address
            </Text>
            <CustomTextInput
              label="Post code"
              value={defaultAddress?.post_code || ""}
              editable={false}
            />
            <CustomTextInput
              label="City"
              value={defaultAddress?.city || ""}
              editable={false}
            />
            <CustomTextInput
              label="Home Address"
              value={defaultAddress?.addr || ""}
              editable={false}
            />
          </View>

          <View className="mt-[16px]">
            <Button
              title="Add new address"
              onPress={() => setShowModal(true)}
              paddingVertical={10}
              borderWidth={0}
            />
          </View>
        </View>
      </ScrollView>

      <ChangeAddressModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => {
          fetchUser();
          setShowModal(false);
        }}
        defaultAddress={defaultAddress}
      />
    </ScreenWrapper>
  );
}
