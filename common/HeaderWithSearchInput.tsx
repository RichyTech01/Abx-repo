import { View, Text } from "react-native";
import Header from "./Header";
import SearchInput from "./SearchInput";

interface HeaderWithSearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
}

export default function HeaderWithSearchInput({
  label,
  placeholder,
  value,
  onChangeText,
}: HeaderWithSearchInputProps) {
  return (
    <View className="">
      <Header title={label} />
      <View className="mt-[16px] mx-[20px]">
        <SearchInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}
