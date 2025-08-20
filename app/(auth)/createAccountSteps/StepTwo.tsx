import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import AuthApi from "@/api/AuthApi";

export default function StepTwo({
  formData,
  setFormData,
  onSubmit,
  loading,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  loading?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Fetch suggestions based on input
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

  // Function to extract UK postcode from address string
  const extractPostcode = (address: string) => {
    const postcodeRegex = /\b([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})\b/i;
    const match = address.match(postcodeRegex);
    return match ? match[1].trim() : "";
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (item: any) => {
    const addressParts = item.address.split(",");

    // Try to extract postcode from the address using regex
    const extractedPostcode = extractPostcode(item.address);

    // If no postcode found with regex, fall back to the last part (but limit to 10 chars)
    const fallbackPostcode =
      extractedPostcode ||
      addressParts[addressParts.length - 1].trim().substring(0, 10);

    // Extract city - usually the second to last part
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

  return (
    <View style={{ position: "relative", marginTop: 20 }}>
      <View className="gap-[6%]">
        {/* Postcode input */}
        <CustomTextInput
          label="Post code"
          placeholder="Type your post code"
          value={formData.user_address.post_code}
          onChangeText={(text) => {
            // Limit postcode to 10 characters
            const limitedText = text.substring(0, 10);
            setFormData({
              ...formData,
              user_address: {
                ...formData.user_address,
                post_code: limitedText,
              },
            });
            fetchSuggestions(limitedText);
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
          onChangeText={(text) =>
            setFormData({
              ...formData,
              user_address: { ...formData.user_address, city: text },
            })
          }
        />

        {/* Address input */}
        <CustomTextInput
          label="Home Address"
          placeholder="Clearly state your address"
          value={formData.user_address.addr}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              user_address: { ...formData.user_address, addr: text },
            })
          }
        />

        {/* Password input */}
        <CustomTextInput
          label="Password"
          isPassword
          placeholder="Use a minimum of 7 characters"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
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
        <Text style={{ color: "#0C513F" }}>Terms and Conditions</Text>
      </Text>

      {/* Submit button */}
      <View style={{ marginTop: 24 }}>
        <Button
          title="Click to verify your account"
          loading={loading}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
}
