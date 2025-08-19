import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type PhoneNumberInputProps = {
  label?: string;
  placeholder?: string;
  defaultCode?: string;
};

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label = "Phone Number",
  placeholder = "Enter your phone number",
  defaultCode = "+234", // fallback to Nigeria
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(defaultCode);

  return (
    <View>
      {/* Label */}
      {label && (
        <Text className="text-[14px] font-urbanist-medium leading-[20px] text-[#2D2220]">
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          { borderColor: isFocused ? "#0C513F" : "#F1EAE7" },
        ]}
        className="mt-[8px]"
      >
        {/* Country Code */}
        <TouchableOpacity>
          <Text style={styles.codeText}>{countryCode}</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Phone Input */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#929292"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={11}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    height: 45,
  },
  codeText: {
    fontSize: 14,
    color: "#0C513F",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#2D2220",
  },
});

export default PhoneNumberInput;
