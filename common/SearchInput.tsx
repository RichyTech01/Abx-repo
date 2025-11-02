import { View, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Seacrchicon from "@/assets/svgs/SearchIcon.svg";

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({
  placeholder = "Search ABX Store",
}: SearchInputProps) {
  const router = useRouter();

  return (
    <View className="relative z-50">
      <TouchableOpacity
        className="flex-row items-center bg-[#f2f2f2] rounded-[10px] px-5 py-3 mb-1 border border-[#D7D7D7]"
        onPress={() => router.push("/Screens/SearchScreen")}
      >
        <View className="mr-2">
          <Seacrchicon />
        </View>
        <TextInput
          className="flex-1 text-[14px] text-black font-urbanist"
          placeholder={placeholder}
          placeholderTextColor="#656565"
          selectionColor="#036047"
          autoCorrect={false}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
    </View>
  );
}
