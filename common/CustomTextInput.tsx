import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from "react-native";
// import EyeIconOpen from "@/assets/svgs/InputEyeOpenicon.svg";

type CustomTextInputProps = TextInputProps & {
  label?: string;
  isPassword?: boolean;
};

export default function CustomTextInput({ label, isPassword = false, ...props }: CustomTextInputProps) {
  const [secureText, setSecureText] = useState(isPassword);

  return (
    <View style={{ marginVertical: 8 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          secureTextEntry={secureText}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.iconWrapper}>
            {/* {secureText ? (
              <EyeIconOpen width={24} height={24} />
            ) : (
              <EyeIconOpen width={24} height={24} />
            )} */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#000",
    paddingRight: 36, // make space for the eye icon
  },
  iconWrapper: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
