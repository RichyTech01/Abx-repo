import { View } from "react-native";
import React, { useState, useEffect } from "react";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import CustomPhoneInput from "@/common/PhoneNumberInput";
import showToast from "@/utils/showToast";

export default function StepOne({
  nextStep,
  formData,
  setFormData,
}: {
  nextStep: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [rawPhoneNumber, setRawPhoneNumber] = useState(
    formData.phone_number?.replace("+44", "") || ""
  );

  const handleNext = () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !rawPhoneNumber
    ) {
      showToast("error", "Please fill in all the fields before continuing.");
      return;
    }

    const fullPhoneNumber = `+44${rawPhoneNumber}`;
    setFormData({
      ...formData,
      phone_number: fullPhoneNumber,
    });
    nextStep();
  };

  return (
    <View className="mt-[7%]">
      <View className="gap-[32px]">
        <CustomTextInput
          label="First Name"
          placeholder="Type your first name"
          value={formData.first_name}
          onChangeText={(text) =>
            setFormData({ ...formData, first_name: text })
          }
        />

        <CustomTextInput
          label="Last Name"
          placeholder="Type your last name"
          value={formData.last_name}
          onChangeText={(text) => setFormData({ ...formData, last_name: text })}
        />

        <CustomTextInput
          label="Email Address"
          placeholder="Type your email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />

        <CustomPhoneInput
          value={rawPhoneNumber}
          onChange={(phone) => setRawPhoneNumber(phone)}
        />

        <Button
          title="Click to continue"
          textColor="#0C513F"
          backgroundColor="#ECF1F0"
          borderColor="#AEC5BF"
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
