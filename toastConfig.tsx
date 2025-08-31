// toastConfig.tsx (or inline in RootLayout)
import React from "react";
import { View, Text } from "react-native";
import type { ToastConfig } from "react-native-toast-message";

const Box = ({
  title,
  message,
  accent,
  textColor,
}: {
  title?: string;
  message?: string;
  accent: string;
  textColor: string;
}) => (
  <View
    style={{
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 16,
      padding: 12,
      backgroundColor: "#fff",
      borderLeftWidth: 6,
      borderLeftColor: accent,
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      width: "80%"
    }}
  >
    {!!title && (
      <Text
        style={{
          fontSize: 15,
          fontWeight: "600",
          color: textColor, // full control
        }}
        numberOfLines={4}
      >
        {title}
      </Text>
    )}
    {!!message && (
      <Text
        style={{
          marginTop: title ? 2 : 0,
          fontSize: 14,
          fontWeight: "400",
          color: textColor, // full control
        }}
      >
        {message}
      </Text>
    )}
  </View>
);

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <Box
      title={text1 as string}
      message={text2 as string}
      accent="#22c55e"
      textColor="black"
    />
  ),
  error: ({ text1, text2 }) => (
    <Box
      title={text1 as string}
      message={text2 as string}
      accent="#ef4444"
      textColor="black"
    />
  ),
  info: ({ text1, text2 }) => (
    <Box
      title={text1 as string}
      message={text2 as string}
      accent="amber"
      textColor="black"
    />
  ),
};
