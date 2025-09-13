import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import OrderApi from "@/api/OrderApi";
import AuthApi from "@/api/AuthApi"; 
import showToast from "@/utils/showToast";
import { useNavigation } from "@react-navigation/native";

export default function ChangeAddressScreen() {
  const navigation = useNavigation();

  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const disabled = !postCode || !city || !address;

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

    setPostCode(fallbackPostcode);
    setCity(extractedCity);
    setAddress(item.address);

    setSuggestions([]);
  };

  const handleSaveChanges = async () => {
    if (!postCode || !city || !address) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    const payload = { addr: address, post_code: postCode, city };

    try {
      setLoading(true);
      const res = await OrderApi.addAddress(payload);
      showToast("success", "Address updated successfully");
      navigation.goBack();
      return res;
    } catch (err: any) {
      console.log("Change address error:", err.response?.data || err);
      showToast(
        "error",
        err.response?.data?.message ||
          "Something went wrong while updating address"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header title="Change address" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white py-[16px] px-[24px] mt-[10%] mx-[24px] relative">
          <View className="gap-[16px]">
            {/* Postcode input */}
            <CustomTextInput
              label="Post code"
              placeholder="Type your post code"
              value={postCode}
              onChangeText={(text) => {
                const limitedText = text.substring(0, 10);
                setPostCode(limitedText);
                fetchSuggestions(limitedText);
              }}
            />

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 60,
                  left: 24,
                  right: 24,
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
                    <Text style={{ fontSize: 10, color: "#2D2220", lineHeight: 14 }}>
                      {item.address}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <CustomTextInput
              label="City"
              placeholder="Please select a region"
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

          <View className="mt-[16px]">
            <Button
              title={"Save changes"}
              onPress={handleSaveChanges}
              paddingVertical={10}
              borderWidth={0}
              disabled={loading || disabled}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
