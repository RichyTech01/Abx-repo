import {
  View,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import Header from "@/common/Header";
import { useState, useEffect } from "react";
import CategoryCard from "@/common/Categorycard";
import { useRouter } from "expo-router";
import { Dimensions } from "react-native";
import OreAppText from "@/common/OreApptext";
import ScreenWrapper from "@/common/ScreenWrapper";
import StoreApi from "@/api/StoreApi";

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

export default function AllCategories() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const SCREEN_PADDING = 20;
  const GAP = 16;
  const ITEM_WIDTH =
    (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await StoreApi.getCategories();
        const withColors = (data.results || []).map((cat: any) => ({
          ...cat,
          ...CATEGORY_COLORS[cat.id],
        }));
        setCategories(withColors);
        // console.log("category data", withColors);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <ScreenWrapper>
      <View className={``}>
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
            paddingHorizontal: SCREEN_PADDING,
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
                  width: ITEM_WIDTH,
                  alignItems: "center",
                }}
              >
                <CategoryCard
                  bgColor={item.bgColor}
                  borderColor={item.borderColor}
                  image={{ uri: item.img }}
                  title={item.name}
                  subtitle={item.description}
                  paddingY={10}
                  width={ITEM_WIDTH}
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
    </ScreenWrapper>
  );
}
