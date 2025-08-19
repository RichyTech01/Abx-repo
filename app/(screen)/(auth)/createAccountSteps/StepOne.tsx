import { View, Text } from "react-native";
import { useState } from "react";
import React from "react";
import CustomTextInput from "@/common/CustomTextInput";
import PhoneNumberInput from "@/common/PhoneNumberInput";
import Button from "@/common/Button";

export default function StepOne({nextStep}: { nextStep: () => void }) {
  const [phone, setPhone] = useState("");
  return (
    <View className="mt-[7%] ">
      <View className="gap-[32px]  ">
        <CustomTextInput
          label="First Name"
          placeholder="Type your first name"
        />

        <CustomTextInput label="Last Name" placeholder="Type your last name" />
        <CustomTextInput
          label="Email Address"
          placeholder="Type your last name"
        />

        <PhoneNumberInput value={phone} onChange={setPhone} />

        <Button
          title="Click to continue"
          textColor="#0C513F"
          backgroundColor="#ECF1F0"
          borderColor="#AEC5BF"
          onPress={nextStep}
        />
      </View>
    </View>
  );
}
