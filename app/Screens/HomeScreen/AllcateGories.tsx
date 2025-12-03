import {
  View,
  FlatList,
  Platform,
  RefreshControl,
  Dimensions,
} from "react-native";
import Header from "@/common/Header";
import CategoryCard from "@/common/Categorycard";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/common/ScreenWrapper";
import StoreApi from "@/api/StoreApi";
import NoData from "@/common/NoData";
import { useQuery } from "@tanstack/react-query";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import OreAppText from "@/common/OreApptext";
import { generateCategoryColor } from "@/utils/generateCategoryColor";

const CATEGORY_COLORS: Record<
  number,
  { bgColor: string; borderColor: string }
> = {
  1: { bgColor: "#ECF1F0", borderColor: "#5D8B7F" },
  2: { bgColor: "#FDF0DC", borderColor: "#F4B551" },
  3: { bgColor: "#EBFFDF", borderColor: "#05A85A" },
  4: { bgColor: "#DCE7FD", borderColor: "#89AFFD" },
  5: { bgColor: "#FDE6F2", borderColor: "#D14A78" },
  6: { bgColor: "#FDF0DC", borderColor: "#B29870" },
};

export default function AllCategories() {
  const router = useRouter();
  const shimmerAnim = useShimmerAnimation();

  const SCREEN_PADDING = 20;
  const GAP = 16;
  const ITEM_WIDTH =
    (Dimensions.get("window").width - SCREEN_PADDING * 2 - GAP) / 2;

  const {
    data: categories = [],
    isLoading: loading,
    refetch,
    error,
    isRefetching: refreshing,
  } = useQuery({
    queryKey: ["All-categories"],
    queryFn: async () => {
      const data = await StoreApi.getCategories();
      const withColors = (data.results || []).map((cat: any, idx: number) => ({
        ...cat,
        ...generateCategoryColor(idx),
      }));

      return withColors;
    },
    staleTime: 1000 * 60 * 10,
  });

  const HandleRefreshing = async () => {
    await refetch();
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
      renderItem={() => (
        <SkeletonCard
          shimmerAnim={shimmerAnim}
          style={{ width: ITEM_WIDTH, height: 140 }}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 items-center justify-center py-4">
      <NoData
        title="Empty data"
        subtitle="No category data at the moment, come back later"
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <View className={``}>
        <Header title="All categories" />
      </View>
      {loading ? (
        renderSkeletons()
      ) : error ? (
        <View className="mx-auto py-6">
          <OreAppText className="text-[20px] text-red-500 ">
            Fetch Error
          </OreAppText>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={HandleRefreshing}
              colors={["#0C513F"]}
            />
          }
          ListEmptyComponent={ListEmptyComponent}
        />
      )}
    </ScreenWrapper>
  );
}
