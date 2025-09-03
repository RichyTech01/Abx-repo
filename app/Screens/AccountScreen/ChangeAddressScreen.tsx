import { View, ScrollView } from "react-native";
import { useState } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import OrderApi from "@/api/OrderApi";
import showToast from "@/utils/showToast";
import { useNavigation } from "@react-navigation/native";

export default function ChangeAddressScreen() {
  const navigation = useNavigation();

  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async () => {
    if (!postCode || !city || !address) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    const payload = {
      addr: address,
      post_code: postCode,
      city,
    };

    try {
      setLoading(true);
      const res = await OrderApi.addAddress(payload);
      showToast("success", "Address updated successfully");
      navigation.goBack();
      return res;
    } catch (err: any) {
      console.log("Change address error:", err.response?.data || err);
      showToast(
        "error",
        err.response?.data?.message ||
          "Something went wrong while updating address"
      );
    } finally {
      setLoading(false);
    }
  };

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
              value={postCode}
              onChangeText={setPostCode}
            />
            <CustomTextInput
              label="City"
              placeholder="Please select a region"
              value={city}
              onChangeText={setCity}
            />
            <CustomTextInput
              label="Home Address"
              placeholder="Clearly state your address"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View className="mt-[16px]">
            <Button
              title={"Save changes"}
              onPress={handleSaveChanges}
              paddingVertical={10}
              borderWidth={0}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
