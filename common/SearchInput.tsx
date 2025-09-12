import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router"; // Expo Router
import Seacrchicon from "@/assets/svgs/SearchIcon.svg";
import StoreApi from "@/api/StoreApi";
import UrbanistText from "./UrbanistText";

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

  const router = useRouter(); // Use Expo Router

  // Debounce the search
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
      setShowResults(res.products?.length > 0);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (item: any) => {
    setShowResults(false);
    setQuery(item.item_name);

    // Navigate to product details page using router
    router.push({
      pathname: "/Screens/HomeScreen/ProductDetails", // Your product detail route
      params: { id: item.id.toString() }, // Pass product ID
    });
  };

  return (
    <View style={{ zIndex: 1000, position: "relative" }}>
      <View style={styles.container}>
        <View style={styles.icon}>
          <Seacrchicon />
        </View>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#656565"
          value={query}
          onChangeText={setQuery}
          onFocus={() => setShowResults(results.length > 0)}
        />
      </View>

      {loading && <Text style={{ marginTop: 5 }}>Searching...</Text>}

      {showResults && (
        <ScrollView
          style={[styles.modal, { position: "absolute", top: 60, left: 0, right: 0 }]}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          {results.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.resultItem}
              onPress={() => handleSelectItem(item)}
              className="flex-row items-center gap-[8px]"
            >
              <Image
                source={{ uri: item?.prod_image_url }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  marginRight: 8,
                }}
              />
              <UrbanistText className="text-[#121212] text-[12px] leading-[16px]">
                {item.item_name}
              </UrbanistText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    fontFamily: "UrbanistRegular",
  },
  modal: {
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  resultItem: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
