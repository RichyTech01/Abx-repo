import React from "react";
import { Text, TextProps } from "react-native";

interface UrbanistTextProps extends TextProps {
  className?: string;
  fontFamily?: string; 
}

export default function UrbanistText({
  children,
  className,
  fontFamily = "UrbanistRegular", 
  style,
  ...props
}: UrbanistTextProps) {
  return (
    <Text
      className={className}
      style={[{ fontFamily }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}
