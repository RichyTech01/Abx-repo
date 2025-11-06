import { View, Animated, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";

type ProductSkeletonProps = {
  width?: number;
  variant?: "grid" | "horizontal";
};

export const ProductSkeleton = ({ 
  width, 
  variant = "grid" 
}: ProductSkeletonProps) => {
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

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  if (variant === "horizontal") {
    return (
      <Animated.View
        style={{
          opacity,
          width: width || 160,
          height: 220,
          backgroundColor: "#E1E9EE",
          borderRadius: 12,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 140,
            backgroundColor: "#C4D1DA",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginBottom: 8,
          }}
        />
        <View style={{ paddingHorizontal: 12 }}>
          <View
            style={{
              width: "80%",
              height: 14,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
              marginBottom: 6,
            }}
          />
          <View
            style={{
              width: "60%",
              height: 12,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: "40%",
              height: 16,
              backgroundColor: "#C4D1DA",
              borderRadius: 4,
            }}
          />
        </View>
      </Animated.View>
    );
  }

  // Grid variant
  return (
    <Animated.View
      style={{
        opacity,
        width: width,
        backgroundColor: "#E1E9EE",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <View className="h-40 bg-[#C4D1DA]" />
      <View className="p-3">
        <View className="h-4 bg-[#C4D1DA] rounded mb-2 w-3/4" />
        <View className="h-3 bg-[#C4D1DA] rounded mb-2 w-1/2" />
        <View className="h-4 bg-[#C4D1DA] rounded w-1/3" />
      </View>
    </Animated.View>
  );
};

type ProductSkeletonGridProps = {
  count?: number;
  itemWidth: number;
  screenPadding?: number;
  gap?: number;
};

export const ProductSkeletonGrid = ({ 
  count = 6, 
  itemWidth,
  screenPadding = 20,
  gap = 16,
}: ProductSkeletonGridProps) => {
  return (
    <View
      style={{
        paddingHorizontal: screenPadding,
        paddingTop: 16,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <View key={`skeleton-${index}`} style={{ marginBottom: gap }}>
            <ProductSkeleton width={itemWidth} variant="grid" />
          </View>
        ))}
    </View>
  );
};