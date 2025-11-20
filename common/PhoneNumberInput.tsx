import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import FlagIcon from "@/assets/svgs/UkFlag.svg";

type Props = {
  label?: string;
  value: string;
  onChange: (text: string) => void;
  error?: string; // ✅ add error prop
};

const CustomPhoneInput: React.FC<Props> = ({
  label = "Phone number",
  value,
  onChange,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const callingCode = "44";

  // ✅ dynamic border color
  const getBorderColor = () => {
    if (error) return "#F04438";
    if (isFocused) return "#0C513F"; // green when focused
    return "#EFEFEF"; // default
  };

  return (
    <View>
      <Text className="text-[14px] font-urbanist-medium leading-[20px] text-[#2D2220]">
        {label}
      </Text>

      <View style={[styles.container, { borderColor: getBorderColor() }]}>
        <FlagIcon />

        <Text className="text-[#929292] text-[12px] font-urbanist leading-[16px] mr-[4px] ml-[6px]">
          +{callingCode}
        </Text>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          className="text-[12px] font-urbanist   "
          placeholder="Type phone number"
          keyboardType="phone-pad"
          inputMode="numeric"
          value={value}
          // maxLength={10}
          onChangeText={onChange}
          placeholderTextColor="#929292"
          selectionColor="#0C513F"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {/* ✅ show error text */}
      {error ? (
        <Text style={{ color: "#F04438", fontSize: 10, marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 45,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ddd",
    marginRight: 14,
    marginLeft: 10,
  },
  input: {
    flex: 1,
  },
});

export default CustomPhoneInput;
