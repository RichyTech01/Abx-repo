import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import FlagIcon from "@/assets/svgs/UkFlag.svg";

type Props = {
  label?: string;
  value: string;
  onChange: (text: string) => void;
};

const CustomPhoneInput: React.FC<Props> = ({
  label = "Phone number",
  value,
  onChange,
}) => {
  const callingCode = "44";

  return (
    <View>
      <Text className="text-[14px] font-urbanist-medium leading-[20px] text-[#2D2220]">
        {label}
      </Text>

      <View style={styles.container}>
        <View className=" ">
          <FlagIcon />
        </View>

        <Text className="text-[#929292] text-[12px] font-urbanist leading-[16px] mr-[4px] ml-[6px]">
          +{callingCode}
        </Text>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          placeholder="Type phone number"
          keyboardType="phone-pad"
          value={value}
          maxLength={10}
          onChangeText={onChange}
          placeholderTextColor="#929292"
          selectionColor="#0C513F"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
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
