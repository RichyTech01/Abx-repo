import {
  View,
  FlatList,
  Platform,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import Header from "@/common/Header";
import { useState, useEffect, useRef } from "react";
import CategoryCard from "@/common/Categorycard";
import { useRouter } from "expo-router";
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
  const [refreshing, setRefreshing] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const SCREEN_PADDING = 20;
  const GAP = 16;
  const ITEM_WIDTH =
    (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await StoreApi.getCategories();
      const withColors = (data.results || []).map((cat: any) => ({
        ...cat,
        ...CATEGORY_COLORS[cat.id],
      }));
      setCategories(withColors);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const HandleRefreshing = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  const SkeletonCard = () => {
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <Animated.View
        style={{
          opacity,
          width: ITEM_WIDTH,
          height: 140,
          backgroundColor: "#E1E9EE",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: "#C4D1DA",
            borderRadius: 8,
            marginBottom: 12,
          }}
        />
        <View
          style={{
            width: "70%",
            height: 14,
            backgroundColor: "#C4D1DA",
            borderRadius: 4,
            marginBottom: 6,
          }}
        />
        <View
          style={{
            width: "90%",
            height: 12,
            backgroundColor: "#C4D1DA",
            borderRadius: 4,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            width: "60%",
            height: 12,
            backgroundColor: "#C4D1DA",
            borderRadius: 4,
          }}
        />
      </Animated.View>
    );
  };

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3, 4, 5, 6]}
      keyExtractor={(item) => item.toString()}
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
      renderItem={() => <SkeletonCard />}
      showsVerticalScrollIndicator={false}
    />
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 items-center justify-center">
      <OreAppText>No categories found.</OreAppText>
    </View>
  );

  return (
    <ScreenWrapper>
      <View className={``}>
        <Header title="All categories" />
      </View>
      {loading ? (
        renderSkeletons()
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={HandleRefreshing}
            />
          }
          ListEmptyComponent={ListEmptyComponent}
        />
      )}
    </ScreenWrapper>
  );
}