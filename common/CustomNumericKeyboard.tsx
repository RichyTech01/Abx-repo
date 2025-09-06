import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DeleteIcon from "../assets/svgs/DeleteIcon.svg";

interface CustomNumericKeyboardProps {
  value: string;
  onChange: (val: string) => void;
  maxValue?: number;
}

const CustomNumericKeyboard: React.FC<CustomNumericKeyboardProps> = ({
  value,
  onChange,
  maxValue = 999999,
}) => {
  const handleNumberPress = (num: string) => {
    const cleanValue = value.replace(/,/g, "");
    const newValue = cleanValue + num;
    const numericValue = parseInt(newValue) || 0;
    if (numericValue <= maxValue) {
      onChange(numericValue.toLocaleString());
    }
  };

  const handleDelete = () => {
    const cleanValue = value.replace(/,/g, "");
    if (cleanValue.length > 1) {
      const newValue = cleanValue.slice(0, -1);
      onChange(parseInt(newValue).toLocaleString());
    } else {
      onChange("0");
    }
  };

  const handleDecimal = () => {
    if (!value.includes(".")) {
      onChange(value + ".");
    }
  };

  const KeypadButton: React.FC<{
    children: React.ReactNode;
    onPress: () => void;
  }> = ({ children, onPress }) => (
    <TouchableOpacity
      className="w-[60px] h-[60px] bg-white rounded-full items-center justify-center mb-6 shadow-[#0000000A]"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text className="text-[#181818] text-lg font-urbanist-semibold">
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );

  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["•", "0", "del"],
  ];

  return (
    <View className="w-full items-center ">
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-between w-full mb-3">
          {row.map((item) => {
            if (item === "del") {
              return (
                <KeypadButton key={item} onPress={handleDelete}>
                  <DeleteIcon />
                </KeypadButton>
              );
            } else if (item === "•") {
              return (
                <KeypadButton key={item} onPress={handleDecimal}>
                  <View className="w-[9px] h-[9px] bg-[#181818] rounded-full" />
                </KeypadButton>
              );
            } else {
              return (
                <KeypadButton
                  key={item}
                  onPress={() => handleNumberPress(item)}
                >
                  {item}
                </KeypadButton>
              );
            }
          })}
        </View>
      ))}
    </View>
  );
};

export default CustomNumericKeyboard;
