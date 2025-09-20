import Toast from "react-native-toast-message";

const showToast = (
  type: "success" | "error" | "info",
  title: string,
  message?: string // Make message optional
) => {
  Toast.show({
    type,
    text1: title,           // Use the provided title
    text2: message,         // Use the optional message
    position: "top",
    visibilityTime: 3000,
  });
};

export default showToast;