import React, { useState } from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
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
  addressId?: string; 
};

export default function ChangeAddressModal({
  visible,
  onClose,
  onSaved,
  addressId,
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

  const handleAddressChange = (newAddressData: AddressData) => {
    setAddressData(newAddressData);
    // Clear errors
    const newErrors = { ...errors };
    if (newAddressData.postCode !== addressData.postCode) delete newErrors.postCode;
    if (newAddressData.city !== addressData.city) delete newErrors.city;
    if (newAddressData.address !== addressData.address) delete newErrors.address;
    setErrors(newErrors);
  };

  const handlePostCodeChange = (postCode: string) => {
    setAddressData(prev => ({ ...prev, postCode }));
    if (errors.postCode) setErrors(prev => ({ ...prev, postCode: undefined }));
  };

  const canSave = () => {
    return (
      addressData.postCode.trim() &&
      addressData.city.trim() &&
      addressData.address.trim()
    );
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

    try {
      setLoading(true);
      if (addressId) {
        // Edit existing address
        await OrderApi.editCustomerAddress(addressId, {
          addr: addressData.address,
          city: addressData.city,
          post_code: addressData.postCode,
        });
        showToast("success", "Address updated successfully");
      } else {
        // Add new address
        await OrderApi.addAddress({
          addr: addressData.address,
          city: addressData.city,
          post_code: addressData.postCode,
        });
        showToast("success", "Address added successfully");
      }
      onSaved();
    } catch (err: any) {
      console.log("Change address error:", err.response?.data || err);
      showToast(
        "error",
        err.response?.data?.detail || "Something went wrong while saving address"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable className="flex-1 justify-center items-center bg-black/30" onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-[90%]"
        >
          <Pressable className="bg-white py-[16px] px-[24px] border border-[#F1EAE7] rounded-lg" onPress={e => e.stopPropagation()}>
            <OreAppText className="text-[20px] leading-[28px] mb-6 mx-auto">
              {addressId ? "Edit Address" : "Add New Address"}
            </OreAppText>

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
