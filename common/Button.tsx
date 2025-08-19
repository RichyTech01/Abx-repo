import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import * as Haptics from "expo-haptics";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "solid" | "outline"; 
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "solid",
  backgroundColor = "#0C513F", // default solid bg
  borderColor = "#0C513F",     // default border
  textColor,                   // auto-computed if not passed
  style,
  textStyle,
}) => {
  const isSolid = variant === "solid";

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.base,
        {
          backgroundColor: isSolid ? backgroundColor : "transparent",
          borderColor: borderColor,
          borderWidth: isSolid ? 1 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isSolid ? "#fff" : borderColor, ...(textColor ? { color: textColor } : {}) },
          textStyle,
        ]}
        className="font-urbanist-bold text-[14px]"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
  },
});

export default Button;
