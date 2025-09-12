import { View, } from "react-native";
import Header from "./Header";
import SearchInput from "./SearchInput";

interface HeaderWithSearchInputProps {
  placeholder?: string;
  label: string;
}

export default function HeaderWithSearchInput({
  label,
  placeholder,
}: HeaderWithSearchInputProps) {
  return (
    <View className="">
      <Header title={label} />
      <View className="mt-[16px] mx-[20px]">
        <SearchInput
          placeholder={placeholder}
        />
      </View>
    </View>
  );
}
