import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Seacrchicon from "@/assets/svgs/SearchIcon.svg";
import StoreApi from "@/api/StoreApi";
import UrbanistText from "./UrbanistText";
import { LoadingSpinner } from "./LoadingSpinner";
import { Keyboard } from "react-native";

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({
  placeholder = "Ask ABX AI or search for food items of your choice",
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 0) {
        searchMarketplace(query);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchMarketplace = async (searchQuery: string) => {
    try {
      setLoading(true);
      const res = await StoreApi.searchMarketplace(searchQuery);
      setResults(res.products || []);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item: any) => {
    Keyboard.dismiss();
    setShowResults(false);
    setQuery("");

    router.push({
      pathname: "/Screens/HomeScreen/ProductDetails",
      params: { id: item.id.toString() },
    });
  };

  return (
    <View className="relative z-50">
      {/* Input box */}
      <View className="flex-row items-center bg-[#f2f2f2] rounded-[10px] px-5 py-3 mb-1">
        <View className="mr-2">
          <Seacrchicon />
        </View>

        <TextInput
          className="flex-1 text-[14px] text-black font-urbanist"
          placeholder={placeholder}
          placeholderTextColor="#656565"
          value={query}
          onChangeText={setQuery}
          onFocus={() => setShowResults(results.length > 0)}
        />
      </View>

      {/* Dropdown */}
      {showResults && (
        <View className="absolute top-[60px] left-0 right-0 max-h-[250px] border border-[#F1EAE7] bg-white rounded-[10px] py-[18px] shadow-md px-[23.01px]">
          {loading ? (
            <View className="py-10 items-center justify-center">
              <LoadingSpinner />
            </View>
          ) : results.length > 0 ? (
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              {results.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelectItem(item)}
                  className="flex-row items-center px- py-2 gap-2 "
                >
                  <Image
                    source={{ uri: item?.prod_image_url }}
                    className="w-[22px] h-[22px] rounded-[8px] mr-2"
                  />
                  <UrbanistText className="text-[#121212] text-[12px] leading-[16px]">
                    {item.item_name}
                  </UrbanistText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View className="py-4 items-center">
              <UrbanistText className="text-[12px] text-[#999]">
                No results found
              </UrbanistText>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
