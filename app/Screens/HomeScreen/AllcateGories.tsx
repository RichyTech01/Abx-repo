import {
  View,
  SafeAreaView,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import Header from "@/common/Header";
import { useState, useEffect } from "react";
import CategoryCard from "@/common/Categorycard";
import { useRouter } from "expo-router";
import AdminApi from "@/api/AdminApi";
import OreAppText from "@/common/OreApptext";

export default function AllCategories() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORY_COLORS: Record<
    number,
    { bgColor: string; borderColor: string }
  > = {
    1: { bgColor: "#ECF1F0", borderColor: "#5D8B7F" },
    3: { bgColor: "#FDF0DC", borderColor: "#F4B551" },
    4: { bgColor: "#EBFFDF", borderColor: "#05A85A" },
    5: { bgColor: "#DCE7FD", borderColor: "#89AFFD" },
    6: { bgColor: "#FDE6F2", borderColor: "#D14A78" },
    7: { bgColor: "#FDF0DC", borderColor: "#B29870" },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await AdminApi.getCategories(1);
        const withColors = (data.results || []).map((cat: any) => ({
          ...cat,
          ...CATEGORY_COLORS[cat.id],
        }));
        setCategories(withColors);
        console.log("category data", withColors);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <View className={`${Platform.OS === "android" ? "mt-[45px] " : ""}`}>
        <Header title="All categories" />
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : categories.length === 0 ? (
        <View className="flex-1 items-center justify-center  ">
          <OreAppText>No categories found.</OreAppText>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 42,
            paddingBottom: 20,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: Platform.OS === "android" ? 40 : 25,
          }}
          renderItem={({ item, index }) => {
            const isOddLast =
              categories.length % 2 !== 0 && index === categories.length - 1;

            return (
              <View
                style={{
                  width: isOddLast ? "100%" : "48%",
                  alignItems: isOddLast ? "center" : "flex-start",
                }}
              >
                <CategoryCard
                  bgColor={item.bgColor}
                  borderColor={item.borderColor}
                  image={{ uri: item.img }}
                  title={item.name}
                  subtitle={item.description}
                  width={180}
                  paddingY={10}
                  onPress={() =>
                    router.push({
                      pathname: "/Screens/HomeScreen/CategoryDetails",
                      params: { category: item.name },
                    })
                  }
                />
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
