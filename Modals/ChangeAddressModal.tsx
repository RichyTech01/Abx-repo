import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from "react-native";
import Button from "@/common/Button";
import OrderApi from "@/api/OrderApi";
import showToast from "@/utils/showToast";
import { AddressData } from "@/hooks/useAddressAutocomplete";
import AddressAutocompleteInput from "@/common/AddressAutocompleteInputProps";
import OreAppText from "@/common/OreApptext";

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
  const [addressData, setAddressData] = useState<AddressData>({
    postCode: "",
    city: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    postCode?: string;
    city?: string;
    address?: string;
  }>({});

  // Store original values to compare against
  const [originalValues, setOriginalValues] = useState<AddressData>({
    postCode: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    if (defaultAddress) {
      const values: AddressData = {
        postCode: defaultAddress.post_code || "",
        city: defaultAddress.city || "",
        address: defaultAddress.addr || "",
      };

      setAddressData(values);
      setOriginalValues(values);
    } else {
      const emptyValues: AddressData = { postCode: "", city: "", address: "" };
      setAddressData(emptyValues);
      setOriginalValues(emptyValues);
    }
  }, [defaultAddress, visible]);

  const handleAddressChange = (newAddressData: AddressData) => {
    setAddressData(newAddressData);
    // Clear related errors when user makes changes
    const newErrors = { ...errors };
    if (newAddressData.postCode !== addressData.postCode) {
      delete newErrors.postCode;
    }
    if (newAddressData.city !== addressData.city) {
      delete newErrors.city;
    }
    if (newAddressData.address !== addressData.address) {
      delete newErrors.address;
    }
    setErrors(newErrors);
  };

  const handlePostCodeChange = (postCode: string) => {
    setAddressData(prev => ({ ...prev, postCode }));
    if (errors.postCode) {
      setErrors(prev => ({ ...prev, postCode: undefined }));
    }
  };

  const isFormEdited = () => {
    return (
      addressData.postCode !== originalValues.postCode ||
      addressData.city !== originalValues.city ||
      addressData.address !== originalValues.address
    );
  };

  const canSave = () => {
    const isValid = addressData.postCode.trim() && addressData.city.trim() && addressData.address.trim();
    const isEdited = isFormEdited();
    const hasOriginalAddress =
      originalValues.postCode || originalValues.city || originalValues.address;

    if (!hasOriginalAddress) {
      return isValid;
    }

    return isValid && isEdited;
  };

  const handleSave = async () => {
    const newErrors: typeof errors = {};

    if (!addressData.postCode.trim()) newErrors.postCode = "Postcode is required";
    if (!addressData.city.trim()) newErrors.city = "City is required";
    if (!addressData.address.trim()) newErrors.address = "Address is required";

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
      await OrderApi.addAddress({ 
        addr: addressData.address, 
        post_code: addressData.postCode, 
        city: addressData.city 
      });
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
            <OreAppText className="text-[20px] leading-[28px] mb-6 mx-auto">Add New Address</OreAppText>

            <AddressAutocompleteInput
              postCodeValue={addressData.postCode}
              cityValue={addressData.city}
              addressValue={addressData.address}
              onAddressChange={handleAddressChange}
              onPostCodeChange={handlePostCodeChange}
              errors={errors}
            />

            <View className="w-full mt-[16px]">
              <Button
                title={"Save changes"}
                onPress={handleSave}
                loading={loading}
                disabled={loading || !canSave()}
                paddingVertical={12}
              />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}