import Toast from "react-native-toast-message";

const showToast = (
  type: "success" | "error" | "info",
  message: string
) => {
  Toast.show({
    type,
    text1: type.toUpperCase(), // small title
    text2: message,            // your full message (wraps to multiple lines)
    position: "top",
    visibilityTime: 3000,
  });
};

export default showToast;
