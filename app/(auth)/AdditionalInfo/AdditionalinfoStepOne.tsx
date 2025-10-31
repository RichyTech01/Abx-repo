import { View } from "react-native";
import React, { useState } from "react";
import Button from "@/common/Button";
import CustomPhoneInput from "@/common/PhoneNumberInput";
import AuthApi from "@/api/AuthApi";

type AdditionalInfoStepOneProps = {
  nextStep: () => void;
};

export default function AdditionalinfoStepOne({ nextStep }: AdditionalInfoStepOneProps) {
  const [rawPhoneNumber, setRawPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!rawPhoneNumber) {
      setError("Phone number is required");
      return;
    }

    const fullPhoneNumber = `+44${rawPhoneNumber}`;

    try {
      setLoading(true);

      // Step 1: validate phone number
      await AuthApi.validateCredential({ phone_number: fullPhoneNumber });

      // Step 2: send phone number to backend
      await AuthApi.updatePhoneNumber({ phone_number: fullPhoneNumber });

      // Step 3: move to next step
      nextStep();
    } catch (err: any) {
      const backendErrors = err.response?.data || {};

      if (backendErrors.phone_number) {
        setError(backendErrors.phone_number[0]);
      } else if (backendErrors.non_field_errors) {
        setError(backendErrors.non_field_errors[0]);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View className="mt-[24px] gap-[32px]">
        <CustomPhoneInput
          value={rawPhoneNumber}
          onChange={(phone) => {
            setRawPhoneNumber(phone);
            if (error) setError("");
          }}
          error={error}
        />

        <Button
          title="Click to continue"
          textColor="#0C513F"
          backgroundColor="#ECF1F0"
          borderColor="#AEC5BF"
          onPress={handleNext} 
          loading={loading}
          disabled={loading}
        />
      </View>
    </View>
  );
}
