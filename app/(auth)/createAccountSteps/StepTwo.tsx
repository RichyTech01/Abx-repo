import { View, Text } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "@/common/CustomTextInput";
import CustomDropdown from "@/common/CustomDropdown";
import Button from "@/common/Button";
import { useRouter } from "expo-router";
import AuthApi from "@/api/AuthApi";

export default function StepTwo() {
  const [region, setRegion] = useState<string | null>(null);
  const [postCode, setPostCode] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const regionOptions = [
    {
      label: "🇺🇸 United States",
      value: "US",
      postCode: "10001",
      address: "New York, NY",
    },
    {
      label: "🇬🇧 United Kingdom",
      value: "UK",
      postCode: "SW1A 1AA",
      address: "London, England",
    },
    {
      label: "🇳🇬 Nigeria",
      value: "NG",
      postCode: "100001",
      address: "Lagos, Nigeria",
    },
    {
      label: "🇨🇦 Canada",
      value: "CA",
      postCode: "M5A 1A1",
      address: "Toronto, Ontario",
    },
  ];

  const handleRegionChange = (value: string) => {
    setRegion(value);

    const selectedRegion = regionOptions.find((r) => r.value === value);
    if (selectedRegion) {
      setPostCode(selectedRegion.postCode);
      setAddress(selectedRegion.address);
    }
  };

  return (
    <View>
      <View className="gap-[32px] mt-[3%] ">
        <CustomDropdown
          label="Please select a region"
          items={regionOptions.map((r) => ({ label: r.label, value: r.value }))}
          value={region}
          onChange={handleRegionChange}
        />

        <CustomTextInput
          label="Post code"
          placeholder="Type your post code"
          value={postCode}
          onChangeText={setPostCode}
        />

        <CustomTextInput
          label="Home Address"
          placeholder="Clearly state your address"
          value={address}
          onChangeText={setAddress}
        />

        <CustomTextInput
          label="Password"
          isPassword
          placeholder="Use a minimum of 7 characters"
        />
      </View>

      <View className="mt-[24px]  ">
        <Text className="text-[12px] leading-[16px] text-center text-[#4A3223]   ">
          By creating an account, you agree to AfrobasketXpress{" "}
          <Text className="text-[#0C513F] text-center ">
            Terms and Conditions
          </Text>
        </Text>
      </View>
      <View className="mt-[24px]  ">
        <Button
          title="Click to verify your account"
          onPress={() => router.push("/VerifyAccountScreen")}
        />
      </View>
    </View>
  );
}
