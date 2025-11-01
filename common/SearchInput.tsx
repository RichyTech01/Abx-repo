import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Seacrchicon from "@/assets/svgs/SearchIcon.svg";
import StoreApi from "@/api/StoreApi";
import UrbanistText from "./UrbanistText";
import { LoadingSpinner } from "./LoadingSpinner";

import { Keyboard } from "react-native";
import { useLocationStore } from "@/store/locationStore";

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({
  placeholder = "Search for food items of your choice",
}: SearchInputProps) {
  const { latitude, longitude } = useLocationStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    const delayDebounce = setTimeout(() => {
      searchMarketplace(query);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchMarketplace = async (searchQuery: string) => {
    try {
      setLoading(true);
      // setResults([]);
      setShowResults(true);
      if (latitude == null || longitude == null) {
        throw new Error("Location not available");
      }

      const res = await StoreApi.searchMarketplace(
        searchQuery,
        latitude,
        longitude
      );

      // assuming response has both products and shops
      const products = (res.products || []).map((p: any) => ({
        ...p,
        type: "product",
      }));

      const shops = (res.stores || []).map((s: any) => ({
        ...s,
        type: "shop",
      }));

      setResults([...products, ...shops]);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item: any) => {
    Keyboard.dismiss();
    setShowResults(false);
    setQuery("");

    if (item.type === "product") {
      router.push({
        pathname: "/Screens/HomeScreen/ProductDetails",
        params: { id: item.id.toString() },
      });
    } else if (item.type === "shop") {
      router.push({
        pathname: "/Screens/HomeScreen/ShopDetails",
        params: {
          id: item.id.toString(),
          image: item?.store_img || "",
        },
      });
    }
  };

  console.log(results[0]);

  return (
    <View className="relative z-50">
      {/* Input box */}
      <View className="flex-row items-center bg-[#f2f2f2] rounded-[10px] px-5 py-3 mb-1 border border-[#D7D7D7]  ">
        <View className="mr-2">
          <Seacrchicon />
        </View>

        <TextInput
          className="flex-1 text-[14px] text-black font-urbanist "
          placeholder={placeholder}
          placeholderTextColor="#656565"
          value={query}
          selectionColor="green"
          onChangeText={setQuery}
          onFocus={() => setShowResults(results.length > 0)}
          autoCorrect={false}
        />
      </View>

      {/* Dropdown */}
      {showResults && (
        <View
          className={`absolute  left-0 right-0 max-h-[250px] border border-[#F1EAE7] bg-white py-[18px] shadow-sm shadow-[#624C39] px-[23.01px] ${
            Platform.OS === "ios" ? "top-[60]" : "top-[70]"
          } `}
          style={{
            shadowColor: "rgba(98, 76, 57, 0.1)",
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
            elevation: 5,
          }}
        >
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
              {results.map((item, index) => (
                <View
                  key={`${item.type}-${item.id}`}
                  className={`flex-row items-center gap-2 px-[10px] ${
                    index === 0
                      ? "bg-[#FDF0DC] px-[10px] mb-2 py-[5px] rounded-[8px]"
                      : "px- py-2"
                  }`}
                >
                  {/* Image */}
                  {item.type === "shop" ? (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/Screens/HomeScreen/ShopDetails",
                          params: {
                            id: item.id.toString(),
                            image: item?.store_img || "",
                          },
                        })
                      }
                    >
                      <Image
                        source={{
                          uri:
                            item?.store_img ||
                            "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
                        }}
                        className="w-[22px] h-[22px] rounded-[8px] mr-2"
                      />
                    </TouchableOpacity>
                  ) : (
                    <Image
                      source={{ uri: item?.prod_image_url }}
                      className="w-[22px] h-[22px] rounded-[8px] mr-2"
                    />
                  )}

                  {/* Text + row tap */}
                  <TouchableOpacity
                    onPress={() => handleSelectItem(item)}
                    className="flex-1"
                  >
                    <UrbanistText className="text-[12px] leading-[16px] text-[#121212]">
                      {item.type === "product"
                        ? item.item_name
                        : item.business_name}
                    </UrbanistText>
                  </TouchableOpacity>

                  <View>
                    <UrbanistText>
                      {item.type === "shop"
                        ? `${item?.distance_km?.toFixed(1)} km`
                        : (() => {
                            const loc = item.store?.store_address?.location;
                            if (!loc) return "—";
                            if (Array.isArray(loc.coordinates)) {
                              const [lon, lat] = loc.coordinates;
                              return `(${lat.toFixed(4)}, ${lon.toFixed(4)})`;
                            }
                            if (loc.lat && loc.lon) {
                              return `(${loc.lat.toFixed(4)}, ${loc.lon.toFixed(
                                4
                              )})`;
                            }
                            return "No location";
                          })()}
                    </UrbanistText>
                  </View>
                </View>
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
