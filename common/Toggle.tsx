import React from "react";
import { View, TouchableOpacity, Animated } from "react-native";

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ value, onValueChange }) => {
  const trackWidth = 44;
  const trackHeight = 20;
  const thumbSize = 20;
  const padding = 2;

  const translateX = value ? trackWidth - thumbSize - padding * 2 : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={{
        width: trackWidth,
        height: trackHeight,
        borderRadius: trackHeight / 2,
        backgroundColor: value ? "#AEC5BF" : "#E4E4E4",
        justifyContent: "center",
        paddingHorizontal: padding,
      }}
    >
      <Animated.View
        style={{
          width: thumbSize,
          height: thumbSize,
          borderRadius: thumbSize / 2,
          backgroundColor: value ? "#0C513F" : "#424242",
          transform: [{ translateX }],
        }}
      />
    </TouchableOpacity>
  );
};

export default Toggle;
