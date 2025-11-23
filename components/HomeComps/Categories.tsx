import { View, FlatList, Text, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import SectionHeader from "@/common/SectionHeader";
import CategoryCard from "@/common/Categorycard";
import { useRouter } from "expo-router";
import StoreApi from "@/api/StoreApi";

type Props = {
  refreshTrigger: boolean;
};

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

export default function Categories({ refreshTrigger }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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
      setCategories(withColors.slice(0, 4));
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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

  const SkeletonCard = () => {
    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <Animated.View
        style={{
          opacity,
          width: 160,
          height: 120,
          backgroundColor: "#E1E9EE",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <View
          style={{
            width: "60%",
            height: 16,
            backgroundColor: "#C4D1DA",
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            width: "80%",
            height: 12,
            backgroundColor: "#C4D1DA",
            borderRadius: 4,
            marginBottom: 6,
          }}
        />
        <View
          style={{
            width: "40%",
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
      data={[1, 2, 3, 4]}
      renderItem={() => <SkeletonCard />}
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
      ) : categories.length === 0 ? (
        <ListEmptyComponent />
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
