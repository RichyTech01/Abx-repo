
import { Text, TextProps } from "react-native";


interface AppTextProps extends TextProps {
  fontFamily?: string; 
}

export default function OreAppText({ fontFamily, style, children, ...props }: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        { fontFamily: fontFamily || "OrelegaOne" }, 
        style,
      ]}
    >
      {children}
    </Text>
  );
}
