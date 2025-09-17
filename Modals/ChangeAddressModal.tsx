import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Button from "@/common/Button";
import CustomTextInput from "@/common/CustomTextInput";
import OrderApi from "@/api/OrderApi";
import AuthApi from "@/api/AuthApi";
import showToast from "@/utils/showToast";

type ChangeAddressModalProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  defaultAddress?: {
    addr: string;
    city: string;
    post_code: string;
  } | null;
};

export default function ChangeAddressModal({
  visible,
  onClose,
  onSaved,
  defaultAddress,
}: ChangeAddressModalProps) {
  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [errors, setErrors] = useState<{
    postCode?: string;
    city?: string;
    address?: string;
  }>({});

  // Store original values to compare against
  const [originalValues, setOriginalValues] = useState({
    postCode: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    if (defaultAddress) {
      const values = {
        postCode: defaultAddress.post_code || "",
        city: defaultAddress.city || "",
        address: defaultAddress.addr || "",
      };

      setPostCode(values.postCode);
      setCity(values.city);
      setAddress(values.address);

      // Store original values for comparison
      setOriginalValues(values);
    } else {
      // If no default address, allow saving when all fields are filled
      const emptyValues = { postCode: "", city: "", address: "" };
      setOriginalValues(emptyValues);
    }
  }, [defaultAddress, visible]);

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

  /** 🔹 Extract postcode from string */
  const extractPostcode = (address: string) => {
    const postcodeRegex = /\b([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})\b/i;
    const match = address.match(postcodeRegex);
    return match ? match[1].trim() : "";
  };

  /** 🔹 Handle suggestion selection */
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

  /** 🔹 Check if form has been edited */
  const isFormEdited = () => {
    return (
      postCode !== originalValues.postCode ||
      city !== originalValues.city ||
      address !== originalValues.address
    );
  };

  /** 🔹 Check if form is valid and edited */
  const canSave = () => {
    const isValid = postCode.trim() && city.trim() && address.trim();
    const isEdited = isFormEdited();

    // If no original address exists (new address), just check if valid
    const hasOriginalAddress =
      originalValues.postCode || originalValues.city || originalValues.address;

    if (!hasOriginalAddress) {
      return isValid;
    }

    return isValid && isEdited;
  };

  /** 🔹 Save new address */
  const handleSave = async () => {
    const newErrors: typeof errors = {};

    if (!postCode.trim()) newErrors.postCode = "Postcode is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    if (
      !isFormEdited() &&
      (originalValues.postCode || originalValues.city || originalValues.address)
    ) {
      showToast("info", "No changes made to save");
      return;
    }

    try {
      setLoading(true);
      await OrderApi.addAddress({ addr: address, post_code: postCode, city });
      showToast("success", "Address updated successfully");
      onSaved();
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
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/30"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[90%]"
        >
          <Pressable
            className="bg-white py-[16px] px-[24px] border border-[#F1EAE7] rounded-lg"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-base font-semibold mb-4">Change Address</Text>

            <View className="gap-[12px] relative">
              {/* Postcode input with autocomplete */}
              <CustomTextInput
                label="Post code"
                placeholder="Type your post code"
                value={postCode}
                onChangeText={(text) => {
                  const limitedText = text.substring(0, 10);
                  setPostCode(limitedText);
                  fetchSuggestions(limitedText);
                  if (errors.postCode)
                    setErrors({ ...errors, postCode: undefined });
                }}
                error={errors.postCode}
              />

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 65,
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
                        style={{
                          fontSize: 12,
                          color: "#2D2220",
                          lineHeight: 16,
                        }}
                      >
                        {item.address}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <CustomTextInput
                label="City"
                placeholder="Enter your city"
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                  if (errors.city) setErrors({ ...errors, city: undefined });
                }}
                error={errors.city}
              />

              <CustomTextInput
                label="Home Address"
                placeholder="Clearly state your address"
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (errors.address)
                    setErrors({ ...errors, address: undefined });
                }}
                error={errors.address}
              />
            </View>

            <View className="w-full mt-[16px] ">
              <Button
                title={"Save changes"}
                onPress={handleSave}
                loading={loading}
                disabled={loading || !canSave()}
                paddingVertical={8}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
