import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "solid" | "outline";
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string; // 👈 color for text
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fontClassName?: string; // 👈 font override
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "solid",
  backgroundColor = "#0C513F",
  borderColor = "#0C513F",
  borderWidth = 1,
  textColor,
  style,
  textStyle,
  loading = false,
  icon,
  iconPosition = "right",
  fontClassName,
}) => {
  const isSolid = variant === "solid";

  const handlePress = () => {
    if (loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // ✅ Determine text color
  const resolvedTextColor =
    textColor || (isSolid ? "#fff" : borderColor || "#000");

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.base,
        {
          backgroundColor: isSolid ? backgroundColor : "transparent",
          borderColor,
          borderWidth,
          opacity: loading ? 0.7 : 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={resolvedTextColor} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <View style={{ marginRight: 6 }}>{icon}</View>
          )}
          <Text
            style={[styles.text, { color: resolvedTextColor }, textStyle]}
            className={fontClassName || "font-urbanist-bold text-[14px]"}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <View style={{ marginLeft: 6 }}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
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
