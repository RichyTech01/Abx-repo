import {
  View,
  ScrollView,
} from "react-native";
import { useState } from "react";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import OreAppText from "@/common/OreApptext";
import { useNavigation } from "@react-navigation/native";
import Button from "@/common/Button";
import Toggle from "@/common/Toggle";
import CustomPhoneInput from "@/common/PhoneNumberInput";
import OrderApi from "@/api/OrderApi";
import showToast from "@/utils/showToast";
import ScreenWrapper from "@/common/ScreenWrapper";

export default function NewDeliveryAddressScreen() {
  const navigaion = useNavigation();
  const [is_guest, setIs_Guest] = useState(false);
  const [fullName, setFullName] = useState("");
  const [rawPhoneNumber, setRawPhoneNumber] = useState("");
  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddAddress = async () => {
    if (is_guest) {
      if (!fullName) {
        showToast("error", "Please enter recipient's full name");
        return;
      }
      if (!rawPhoneNumber) {
        showToast("error", "Please enter recipient's phone number");
        return;
      }
    }

    if (!postCode || !city || !address) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    const payload: any = {
      addr: address,
      post_code: postCode,
      city,
    };

    if (is_guest) {
      payload.is_guest = true;
      payload.full_name = fullName;
      payload.phone = rawPhoneNumber;
    }

    try {
      setLoading(true);

      const res = await OrderApi.addAddress(payload);
      navigaion.goBack();
      showToast("success", "Address added successfully");

      setFullName("");
      setRawPhoneNumber("");
      setPostCode("");
      setCity("");
      setAddress("");
      setIs_Guest(false);

      return res;
    } catch (err: any) {
      console.log("Add address error:", err.response?.data || err);
      showToast(
        "error",
        err.response?.data?.message ||
          "Something went wrong while adding address"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View>
        <Header title="New delivery address" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white p-[16px] mx-[20px] mt-[40px] rounded-[8px]">
          <View className="gap-[18px]">
            {is_guest && (
              <View className="gap-[18px]">
                <CustomTextInput
                  label="Recipient's full name"
                  placeholder="John Thriving"
                  value={fullName}
                  onChangeText={setFullName}
                />

                <CustomPhoneInput
                  value={rawPhoneNumber}
                  onChange={setRawPhoneNumber}
                />
              </View>
            )}

            <CustomTextInput
              label="Post code"
              placeholder="Type your post code"
              value={postCode}
              onChangeText={setPostCode}
            />
            <CustomTextInput
              label="City"
              placeholder="Type your city"
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

          <View className="mt-[24px]">
            <View className="flex-row items-center justify-between">
              <OreAppText className="text-[#424242] text-[14px] leading-[20px]">
                Want to shop for someone else?
              </OreAppText>
              <Toggle value={is_guest} onValueChange={setIs_Guest} />
            </View>

            <View className="mt-[24px]">
              <Button
                title={loading ? "Adding..." : "Add Address"}
                textColor="#0C513F"
                backgroundColor="#ECF1F0"
                borderColor="#AEC5BF"
                onPress={handleAddAddress}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
