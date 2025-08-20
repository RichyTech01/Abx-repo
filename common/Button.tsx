import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
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
  loading?: boolean; 
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "solid",
  backgroundColor = "#0C513F",
  borderColor = "#0C513F",
  textColor,
  style,
  textStyle,
  loading = false,
}) => {
  const isSolid = variant === "solid";

  const handlePress = () => {
    if (loading) return; 
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
          borderWidth: 1,
          opacity: loading ? 0.7 : 1, 
        },
        style,
      ]}
      activeOpacity={0.8}
      disabled={loading} 
    >
      {loading ? (
        <ActivityIndicator color={textColor || (isSolid ? "#fff" : borderColor)} />
      ) : (
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
      )}
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
