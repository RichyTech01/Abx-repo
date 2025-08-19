import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "solid" | "outline"; 
  color?: string; 
  style?: ViewStyle;
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "solid",
  color = "#0C513F", 
  style,
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
          backgroundColor: isSolid ? color : "transparent",
          borderColor: color,
          borderWidth: isSolid ? 0 : 1,
        },
        style,
      ]}
    >
      <Text
        style={{ color: isSolid ? "#fff" : color }}
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
