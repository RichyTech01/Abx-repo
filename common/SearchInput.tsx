import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Seacrchicon from "@/assets/svgs/SearchIcon.svg"

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchInput({
  placeholder = "Ask ABX AI or search for food items of your choice",
  value,
  onChangeText,
}: SearchInputProps) {
  return (
    <View style={styles.container} className="border border-[#D7D7D7] ">
      <View className="mr-[8px]  ">
        <Seacrchicon />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#656565"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    fontFamily:"UrbanistRegular"
  },
});
