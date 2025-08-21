import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label?: string;
  value: string;
  callingCode: string;
  onChange: (text: string) => void;
  onCallingCodeChange: (code: string) => void;
};

const CustomPhoneInput: React.FC<Props> = ({
  label = "Phone number",
  value,
  callingCode,
  onChange,
  onCallingCodeChange,
}) => {
  const [countryCode, setCountryCode] = useState<Country["cca2"]>("GB");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    onCallingCodeChange(country.callingCode[0]);
    setModalVisible(false);
  };

  return (
    <View>
      <Text className="text-[14px] font-urbanist-medium leading-[20px] text-[#2D2220]">
        {label}
      </Text>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.countryContainer}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.flagWrapper}>
            <CountryPicker
              countryCode={countryCode}
              withFlag
              withCallingCode
              withFilter
              withEmoji
              visible={false} 
            />
          </View>
          <Text className="text-[#929292] text-[12px] font-urbanist leading-[16px] mx-[4px]">
            +{callingCode}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#929292" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          placeholder="Type phone number"
          keyboardType="phone-pad"
          value={value}
          onChangeText={onChange}
          placeholderTextColor="#929292"
          selectionColor="#0C513F"
        />
      </View>

      {/* Render country picker modal manually */}
      {modalVisible && (
        <CountryPicker
          countryCode={countryCode}
          withFilter
          withFlag
          withCallingCode
          withAlphaFilter
          onSelect={handleSelectCountry}
          onClose={() => setModalVisible(false)}
          visible={true}
        />
      )}
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
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
  },
  flagWrapper: {
    width: 16,
    height: 16,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
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
