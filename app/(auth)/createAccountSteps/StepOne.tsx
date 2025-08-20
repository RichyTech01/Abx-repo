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
  const [callingCode, setCallingCode] = useState("44");
  const [rawPhoneNumber, setRawPhoneNumber] = useState("");

  // Extract phone number parts if coming back from step 2
  useEffect(() => {
    if (formData.phone_number && formData.phone_number.startsWith('+')) {
      // Extract the calling code and raw number from existing formatted number
      const fullNumber = formData.phone_number.substring(1); // Remove +
      
      // Try to match common country codes
      if (fullNumber.startsWith('234')) {
        setCallingCode('234');
        setRawPhoneNumber(fullNumber.substring(3));
      } else if (fullNumber.startsWith('44')) {
        setCallingCode('44');
        setRawPhoneNumber(fullNumber.substring(2));
      } else if (fullNumber.startsWith('1')) {
        setCallingCode('1');
        setRawPhoneNumber(fullNumber.substring(1));
      } else {
        // Default case
        setCallingCode('44');
        setRawPhoneNumber(fullNumber.substring(2));
      }
    }
  }, [formData.phone_number]);

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
    
    // Create the full phone number with country code for the API
    const fullPhoneNumber = `+${callingCode}${rawPhoneNumber}`;
    
    // Set the phone_number field with the country code as the API expects
    setFormData({ 
      ...formData, 
      phone_number: fullPhoneNumber
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
          callingCode={callingCode}
          onChange={(phone) => setRawPhoneNumber(phone)}
          onCallingCodeChange={(code) => setCallingCode(code)}
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