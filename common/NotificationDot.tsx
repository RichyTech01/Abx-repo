import { View } from "react-native";

interface NotificationDotProps {
  show: boolean;
  children: React.ReactNode;
}

const NotificationDot = ({ show, children }: NotificationDotProps) => {
  return (
    <View className="relative">
      {children}
      {show && (
        <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      )}
    </View>
  );
};

export default NotificationDot;