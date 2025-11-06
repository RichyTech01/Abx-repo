import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GAP = 10;
const INPUT_WIDTH = (SCREEN_WIDTH * 0.8 - GAP * 5) / 6;

interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const hasCalledComplete = useRef(false);

  const handleChange = (text: string, index: number) => {
    // Handle autofill - if text is longer than 1 character, split it
    if (text.length > 1) {
      const digits = text.slice(0, length).split("");
      const newValues = [...values];

      digits.forEach((digit, i) => {
        if (index + i < length) {
          newValues[index + i] = digit;
        }
      });

      setValues(newValues);

      // Focus the last filled input or the next empty one
      const lastFilledIndex = Math.min(index + digits.length - 1, length - 1);
      inputsRef.current[lastFilledIndex]?.focus();

      hasCalledComplete.current = false;
      return;
    }

    // Normal single character input
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);

    if (text && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    // Reset flag when user deletes
    if (!text) {
      hasCalledComplete.current = false;
    }
  };

  useEffect(() => {
    const isComplete = values.every((val) => val.length === 1);

    if (isComplete && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onComplete?.(values.join(""));
    }
  }, [values]);

  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputsRef.current[index] = ref;
          }}
          value={value}
          onChangeText={(text) => handleChange(text, index)}
          keyboardType="number-pad"
          maxLength={length} // Allow full length for autofill
          style={[
            styles.input,
            {
              color: "#DC6C3C",
              marginRight: index === length - 1 ? 0 : GAP,
              width: INPUT_WIDTH,
            },
          ]}
          placeholder="-"
          placeholderTextColor="#DC6C3C"
          textAlign="center"
          selectionColor="#DC6C3C"
          autoComplete="one-time-code" // Enable OTP autofill
          textContentType="oneTimeCode" // iOS autofill
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: "95%",
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#F1EAE7",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
  },
});

export default OTPInput;
