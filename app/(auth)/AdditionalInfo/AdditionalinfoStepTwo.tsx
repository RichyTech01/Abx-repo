import { View, Text } from "react-native";
import React, { useState } from "react";
import Button from "@/common/Button";
import { useRouter } from "expo-router";
import { AddressData } from "@/hooks/useAddressAutocomplete";
import AddressAutocompleteInput from "@/common/AddressAutocompleteInputProps";
import OrderApi from "@/api/OrderApi";
import { useUserStore } from "@/store/useUserStore";
import showToast from "@/utils/showToast";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdditionalinfoStepTwo({
  goBackStep,
}: {
  goBackStep: () => void;
}) {
  const router = useRouter();
  const { fetchUser } = useUserStore();

  const [addressData, setAddressData] = useState<AddressData>({
    address: "",
    city: "",
    postCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Update address form
  const handleAddressChange = (data: AddressData) => {
    setAddressData(data);
    setErrors({});
  };

  // Validation check + API call
  const handleVerify = async () => {
    let newErrors: Record<string, string> = {};

    if (!addressData.postCode) newErrors.post_code = "Post code is required";
    if (!addressData.city) newErrors.city = "City is required";
    if (!addressData.address) newErrors.addr = "Home address is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);

      // Send to backend
      await OrderApi.addAddress({
        addr: addressData.address,
        post_code: addressData.postCode,
        city: addressData.city,
      });

      fetchUser();
      await AsyncStorage.setItem("isLoggedIn", "true");

      router.dismissAll();
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log(
        "Address submission error:",
        err.response?.data.detail || err
      );
      showToast("error", err.response?.data.detail);
      setErrors({
        addr: "Could not save address. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ position: "relative", marginTop: 20 }}>
      <View className="gap-[6%]">
        <AddressAutocompleteInput
          postCodeValue={addressData.postCode}
          cityValue={addressData.city}
          addressValue={addressData.address}
          onAddressChange={handleAddressChange}
          onPostCodeChange={(postCode) =>
            setAddressData((prev) => ({ ...prev, postCode }))
          }
          errors={{
            postCode: errors.post_code,
            city: errors.city,
            address: errors.addr,
          }}
          cityLabel="What city do you currently reside in?"
          cityPlaceholder="e.g London"
        />
      </View>

      {/* Terms */}
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          color: "#4A3223",
        }}
        className="font-urbanist mt-[24px]"
      >
        By creating an account, you agree to AfrobasketXpress{" "}
        <Text
          style={{ color: "#0C513F" }}
          onPress={() =>
            router.push("/Screens/AccountScreen/PrivacyAndPolicyScreen")
          }
          className="font-urbanist"
        >
          Terms and Conditions
        </Text>
      </Text>

      {/* Submit buttons */}
      <View
        style={{ marginTop: 24 }}
        className="flex-row items-center w-full justify-between "
      >
        <View className="w-[40%]">
          <Button
            title="Previous"
            onPress={goBackStep}
            textColor="#0C513F"
            backgroundColor="#ECF1F0"
            borderColor="#AEC5BF"
          />
        </View>
        <View className="w-[58%]">
          <Button
            title="Verify your account"
            loading={submitting}
            onPress={handleVerify}
          />
        </View>
      </View>
    </View>
  );
}
