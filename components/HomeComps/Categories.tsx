import { View, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import SectionHeader from "@/common/SectionHeader";
import CategoryCard from "@/common/Categorycard";
import { useRouter } from "expo-router";
import AdminApi from "@/api/AdminApi";

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORY_COLORS: Record<
    number,
    { bgColor: string; borderColor: string }
  > = {
    1: { bgColor: "#ECF1F0", borderColor: "#5D8B7F" },
    3: { bgColor: "#DDE5FF", borderColor: "#E6A14A" },
    4: { bgColor: "#E6F2FF", borderColor: "#4A90E2" },
    5: { bgColor: "#FDE6F2", borderColor: "#D14A78" },
    6: { bgColor: "#E8F8F5", borderColor: "#48C9B0" },
    7: { bgColor: "#FDF0DC", borderColor: "#F4D03F" },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await AdminApi.getCategories(1);
        const withColors = (data.results || []).map((cat: any) => ({
          ...cat,
          ...CATEGORY_COLORS[cat.id],
        }));
        setCategories(withColors.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View>
      <SectionHeader
        title="Categories"
        onPress={() => router.push("/Screens/HomeScreen/AllcateGories")}
      />

      {loading ? (
        <ActivityIndicator size="small" color={"black"} style={{ marginVertical: 10 }} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
            paddingVertical: 8,
            paddingHorizontal: 20,
          }}
        >
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              title={item.name}
              subtitle={item.description}
              bgColor={item.bgColor}
              borderColor={item.borderColor}
              image={{ uri: item.img }}
              onPress={() =>
                router.push({
                  pathname: "/Screens/HomeScreen/CategoryDetails",
                  params: { category: item.name },
                })
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
