import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GAP = 10; 
const INPUT_WIDTH = (SCREEN_WIDTH * 0.8 - GAP * 5) / 6; 
const OTPInput = ({ length = 6 }) => {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);

   
    if (text && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    
    if (!text && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => { inputsRef.current[index] = ref; }}
          value={value}
          onChangeText={(text) => handleChange(text, index)}
          keyboardType="number-pad"
          maxLength={1}
          style={[
            styles.input,
            {
              color: value === "" ? "#DC6C3C" : "#DC6C3C",
              marginRight: index === length - 1 ? 0 : GAP,
              width: INPUT_WIDTH,
            },
          ]}
          placeholder="-"
          placeholderTextColor="#DC6C3C"
          textAlign="center"
        selectionColor="#DC6C3C"
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
