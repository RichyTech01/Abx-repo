import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CustomTextInputProps = TextInputProps & {
  label?: string;
  isPassword?: boolean;
  placeholder: string;
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  isPassword = false,
  placeholder,
  style,
  ...props
}) => {
  const [secureText, setSecureText] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false); 

  return (
    <View>
      <Text className="text-[14px] font-urbanist-medium leading-[20px] text-[#2D2220]">
        {label}
      </Text>

      <View
        style={[
          styles.inputWrapper,
          { borderColor: isFocused ? "#0C513F" : "#F1EAE7" }, 
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
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            style={styles.iconWrapper}
          >
            <Ionicons name={secureText ? "eye-off" : "eye"} size={15} color="#929292" />
          </TouchableOpacity>
        )}
      </View>
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
    color: "#929292",
  },
  iconWrapper: {
    marginLeft: 8,
  },
});

export default CustomTextInput;
