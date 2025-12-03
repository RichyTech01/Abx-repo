import { View, FlatList, Text } from "react-native";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import CategoryCard from "@/common/Categorycard";
import { useRouter } from "expo-router";
import StoreApi from "@/api/StoreApi";
import { useQuery } from "@tanstack/react-query";
import { SkeletonCard } from "@/common/SkeletonCard";
import { useShimmerAnimation } from "@/hooks/useShimmerAnimation";
import OreAppText from "@/common/OreApptext";

type Props = {
  refreshTrigger: boolean;
};

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

export default function Categories({ refreshTrigger }: Props) {
  const router = useRouter();
  const shimmerAnim = useShimmerAnimation();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await StoreApi.getCategories();
      const withColors = (data.results || []).map((cat: any) => ({
        ...cat,
        ...CATEGORY_COLORS[cat.id],
      }));
      return withColors.slice(0, 4);
    },
    staleTime: 1000 * 60 * 10,
  });

  React.useEffect(() => {
    if (refreshTrigger && error) {
      refetch();
    }
  }, [refreshTrigger]);

  const renderItem = ({ item }: { item: any }) => (
    <CategoryCard
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
  );

  const ListEmptyComponent = () => (
    <Text
      style={{
        textAlign: "center",
        maxWidth: "60%",
      }}
      className="font-orelega py-10 text-black text-[16px] mx-auto justify-center "
    >
      No category shops available at the moment.
    </Text>
  );

  const renderSkeletons = () => (
    <FlatList
      data={[1, 2, 3, 4]}
      renderItem={() => (
        <SkeletonCard
          shimmerAnim={shimmerAnim}
          style={{ width: 160, height: 136 }}
        />
      )}
      keyExtractor={(item) => item.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
      }}
    />
  );

  return (
    <View>
      <SectionHeader
        title="Categories"
        onPress={() => router.push("/Screens/HomeScreen/AllcateGories")}
      />
      {loading ? (
        renderSkeletons()
      ) : error ? (
        <View className="mx-auto py-6">
          <OreAppText className="text-[16px] text-red-500 ">
            Fetch Error
          </OreAppText>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
            paddingVertical: 8,
            paddingHorizontal: 20,
          }}
          ListEmptyComponent={ListEmptyComponent}
        />
      )}
    </View>
  );
}
