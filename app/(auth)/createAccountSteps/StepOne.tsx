import { View, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "@/common/CustomTextInput";
import Button from "@/common/Button";
import CustomPhoneInput from "@/common/PhoneNumberInput";
import { isValidEmail } from "@/utils/isValidateEmail";
import AuthApi from "@/api/AuthApi";
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
  const [rawPhoneNumber, setRawPhoneNumber] = useState(
    formData.phone_number?.replace("+44", "") || ""
  );
  const [marketingConsent, setMarketingConsent] = useState(
    formData.marketing_opt_in ?? false
  );

  console.log(marketingConsent);

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    let newErrors: any = {};

    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!rawPhoneNumber) newErrors.phone_number = "Phone number is required";

    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.keys(newErrors).length > 0) return;

    const fullPhoneNumber = `+44${rawPhoneNumber}`;

    try {
      setLoading(true);

      await AuthApi.validateCredential({
        email: formData.email,
        phone_number: fullPhoneNumber,
      });

      // console.log("Validation success:", res);

      setFormData({
        ...formData,
        phone_number: fullPhoneNumber,
      });
      nextStep();
    } catch (err: any) {
      console.log("Validation error:", err.response?.data);

      const backendErrors = err.response?.data;

      if (backendErrors) {
        let updatedErrors = {
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
        };

        if (backendErrors.email) {
          updatedErrors.email = backendErrors.email[0];
        }
        if (backendErrors.phone_number) {
          updatedErrors.phone_number = backendErrors.phone_number[0];
        }

        if (backendErrors.non_field_errors) {
          const message = backendErrors.non_field_errors[0];

          if (message.toLowerCase().includes("phone")) {
            updatedErrors.phone_number = message;
          } else if (message.toLowerCase().includes("email")) {
            updatedErrors.email = message;
          } else {
            showToast("error", "What's wrong with you?");
          }
        }

        setErrors(updatedErrors);
      } else {
        setErrors({
          ...errors,
          email: "Something went wrong, please try again",
        });
      }
      setLoading(false);
    }
  };

  return (
    <View className="mt-[7%]">
      <View className="gap-[32px]">
        <CustomTextInput
          label="First Name"
          placeholder="Type your first name"
          value={formData.first_name}
          onChangeText={(text) => {
            setFormData({ ...formData, first_name: text });
            if (errors.first_name) setErrors({ ...errors, first_name: "" });
          }}
          error={errors.first_name}
        />

        <CustomTextInput
          label="Last Name"
          placeholder="Type your last name"
          value={formData.last_name}
          onChangeText={(text) => {
            setFormData({ ...formData, last_name: text });
            if (errors.last_name) setErrors({ ...errors, last_name: "" });
          }}
          error={errors.last_name}
        />

        <CustomTextInput
          label="Email Address"
          placeholder="Type your email"
          value={formData.email}
          onChangeText={(text) => {
            setFormData({ ...formData, email: text });
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
          error={errors.email}
        />

        <CustomPhoneInput
          value={rawPhoneNumber}
          onChange={(phone) => {
            setRawPhoneNumber(phone);
            if (errors.phone_number) setErrors({ ...errors, phone_number: "" });
          }}
          error={errors.phone_number}
        />

        {/* Check Box for marketting email */}
        <TouchableOpacity
          onPress={() => {
            const newValue = !marketingConsent;
            setMarketingConsent(newValue);
            setFormData({ ...formData, marketing_consent: newValue });
          }}
          className="flex-row items-center gap-3"
          activeOpacity={0.7}
        >
          <View
            className={`w-5 h-5 rounded border-2 items-center justify-center ${
              marketingConsent
                ? "bg-[#0C513F] border-[#0C513F]"
                : "bg-white border-[#AEC5BF]"
            }`}
          >
            {marketingConsent && (
              <Text className="text-white text-[12px] font-bold ">✓</Text>
            )}
          </View>
          <Text className="text-[#333333] text-sm flex-1">
            I agree to receive marketing emails from ABX
          </Text>
        </TouchableOpacity>

        <Button
          title={"Click to continue"}
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
