import { View, Text } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import { useRouter } from "expo-router";
import { AddressData } from "@/hooks/useAddressAutocomplete";
import AddressAutocompleteInput from "@/common/AddressAutocompleteInputProps";

export default function StepTwo({
  formData,
  setFormData,
  onSubmit,
  loading,
  goBackStep,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  loading?: boolean;
  goBackStep: () => void;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddressChange = (addressData: AddressData) => {
    setFormData({
      ...formData,
      user_address: {
        ...formData.user_address,
        addr: addressData.address,
        city: addressData.city,
        post_code: addressData.postCode,
      },
    });

    // Clear related errors
    const newErrors = { ...errors };
    if (addressData.postCode) delete newErrors.post_code;
    if (addressData.city) delete newErrors.city;
    if (addressData.address) delete newErrors.addr;
    setErrors(newErrors);
  };

  const handlePostCodeChange = (postCode: string) => {
    setFormData({
      ...formData,
      user_address: {
        ...formData.user_address,
        post_code: postCode,
      },
    });
    setErrors((prev) => ({ ...prev, post_code: "" }));
  };

  // Validation check
  const handleVerify = () => {
    let newErrors: Record<string, string> = {};

    if (!formData.user_address.post_code)
      newErrors.post_code = "Post code is required";
    if (!formData.user_address.city) newErrors.city = "City is required";
    if (!formData.user_address.addr)
      newErrors.addr = "Home Address is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <View style={{ position: "relative", marginTop: 20 }}>
      <View className="gap-[6%]">
        <AddressAutocompleteInput
          postCodeValue={formData.user_address.post_code}
          cityValue={formData.user_address.city}
          addressValue={formData.user_address.addr}
          onAddressChange={handleAddressChange}
          onPostCodeChange={handlePostCodeChange}
          errors={{
            postCode: errors.post_code,
            city: errors.city,
            address: errors.addr,
          }}
          cityLabel="What city do you currently reside in?"
          cityPlaceholder="e.g London"
        />

        {/* Password input */}
        <CustomTextInput
          label="Password"
          isPassword
          placeholder="Use a minimum of 7 characters"
          value={formData.password}
          error={errors.password}
          onChangeText={(text) => {
            setFormData({ ...formData, password: text });
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />
      </View>

      {/* Terms */}
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          color: "#4A3223",
        }}
      >
        By creating an account, you agree to AfrobasketXpress{" "}
        <Text
          style={{ color: "#0C513F" }}
          onPress={() =>
            router.push("/Screens/AccountScreen/PrivacyAndPolicyScreen")
          }
        >
          Terms and Conditions
        </Text>
      </Text>

      {/* Submit button */}
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
            loading={loading}
            onPress={handleVerify}
          />
        </View>
      </View>
    </View>
  );
}
