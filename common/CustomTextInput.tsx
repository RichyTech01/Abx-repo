import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CustomTextInputProps = TextInputProps & {
  label?: string;
  isPassword?: boolean;
  placeholder?: string;
  error?: string; // 👈 add this
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  isPassword = false,
  placeholder,
  error,
  style,
  ...props
}) => {
  const [secureText, setSecureText] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      {label && (
        <Text className="text-[14px] font-urbanist-medium leading-[20px] text-[#2D2220]">
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: error
              ? "red" // 👈 red if error
              : isFocused
              ? "#0C513F" // 👈 green if focused
              : "#F1EAE7", // 👈 default
          },
        ]}
        className="mt-[8px]"
      >
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={secureText}
          placeholder={placeholder}
          placeholderTextColor={"#929292"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#0C513F"
          className="font-urbanist"
          {...props}
        />
        {isPassword && (
          <Pressable
            onPress={() => setSecureText(!secureText)}
            style={styles.iconWrapper}
            className="h-full w-8 items-end justify-center"
          >
            <Ionicons
              name={secureText ? "eye-off-outline" : "eye-outline"}
              size={15}
              color="#929292"
            />
          </Pressable>
        )}
      </View>

      {/* 👇 Show error message if available */}
      {error && (
        <Text style={styles.errorText} className="mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    height: 45,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: "black",
  },
  iconWrapper: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 10,
    color: "#F04438",
  },
});

export default CustomTextInput;
