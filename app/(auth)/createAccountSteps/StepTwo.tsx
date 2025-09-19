import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import AuthApi from "@/api/AuthApi";
import { useRouter } from "expo-router";

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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchSuggestions = async (term: string) => {
    if (!term) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await AuthApi.autocomplete(term);
      setSuggestions(data || []);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  const extractPostcode = (address: string) => {
    const postcodeRegex = /\b([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})\b/i;
    const match = address.match(postcodeRegex);
    return match ? match[1].trim() : "";
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (item: any) => {
    const addressParts = item.address.split(",");
    const extractedPostcode = extractPostcode(item.address);
    const fallbackPostcode =
      extractedPostcode ||
      addressParts[addressParts.length - 1].trim().substring(0, 10);

    const extractedCity =
      addressParts.length > 2
        ? addressParts[addressParts.length - 2].trim()
        : "";

    setFormData({
      ...formData,
      user_address: {
        ...formData.user_address,
        addr: item.address,
        city: extractedCity,
        post_code: fallbackPostcode,
      },
    });

    setSuggestions([]);
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
        {/* Postcode input */}
        <CustomTextInput
          label="Post code"
          placeholder="Type your post code"
          value={formData.user_address.post_code}
          error={errors.post_code}
          onChangeText={(text) => {
            const limitedText = text.substring(0, 10);
            setFormData({
              ...formData,
              user_address: {
                ...formData.user_address,
                post_code: limitedText,
              },
            });
            fetchSuggestions(limitedText);
            setErrors((prev) => ({ ...prev, post_code: "" }));
          }}
        />

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <View
            style={{
              position: "absolute",
              top: 55,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#F1EAE7",
              borderRadius: 8,
              zIndex: 999,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectSuggestion(item)}
                style={{ padding: 10 }}
              >
                <Text
                  style={{ fontSize: 10, color: "#2D2220", lineHeight: 14 }}
                >
                  {item.address}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* City input */}
        <CustomTextInput
          label="What city do you currently reside in?"
          placeholder="e.g London"
          value={formData.user_address.city}
          error={errors.city}
          onChangeText={(text) => {
            setFormData({
              ...formData,
              user_address: { ...formData.user_address, city: text },
            });
            setErrors((prev) => ({ ...prev, city: "" }));
          }}
        />

        {/* Address input */}
        <CustomTextInput
          label="Home Address"
          placeholder="Clearly state your address"
          value={formData.user_address.addr}
          error={errors.addr}
          onChangeText={(text) => {
            setFormData({
              ...formData,
              user_address: { ...formData.user_address, addr: text },
            });
            setErrors((prev) => ({ ...prev, addr: "" }));
          }}
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
