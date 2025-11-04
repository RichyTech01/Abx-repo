import { ScrollView, View, Animated } from "react-native";
import { useEffect, useRef } from "react";

export const OrderSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping shimmer animation
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
  }, [shimmerAnim]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white mt-[20px]">
        <View className="border border-[#F1EAE7] rounded-[8px] px-[10px] py-[10px]">
          {/* First Row */}
          <View className="flex-row items-center justify-between gap-4 mb-[16px]">
            <View className="flex-1">
              <SkeletonBox shimmerAnim={shimmerAnim} width="60%" height={14} />
              <View className="mt-[8px]">
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width="80%"
                  height={12}
                />
              </View>
            </View>
            <View className="flex-1">
              <SkeletonBox shimmerAnim={shimmerAnim} width="60%" height={14} />
              <View className="mt-[8px]">
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width="40%"
                  height={12}
                />
              </View>
            </View>
          </View>

          {/* Second Row */}
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1">
              <SkeletonBox shimmerAnim={shimmerAnim} width="60%" height={14} />
              <View className="mt-[8px]">
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width="70%"
                  height={12}
                />
              </View>
            </View>
            <View className="flex-1">
              <SkeletonBox shimmerAnim={shimmerAnim} width="70%" height={14} />
              <View className="mt-[8px]">
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width="50%"
                  height={12}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Items Skeleton */}
        <View className="mt-[8px] px-[10px]">
          {[1, 2].map((item) => (
            <View key={item} className="flex-row items-center py-[16px]">
              <SkeletonBox
                shimmerAnim={shimmerAnim}
                width="146px"
                height={107}
              />
              <View className="ml-[15px] flex-1">
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width="70%"
                  height={16}
                />
                <View className="mt-[8px]">
                  <SkeletonBox
                    shimmerAnim={shimmerAnim}
                    width="40%"
                    height={14}
                  />
                </View>
                <View className="mt-[12px]">
                  <SkeletonBox
                    shimmerAnim={shimmerAnim}
                    width="80px"
                    height={28}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Status Skeleton */}
        <View className="flex-row items-center ml-[8px] my-[8px]">
          <SkeletonBox shimmerAnim={shimmerAnim} width="20px" height={20} />
          <View className="ml-[8px]">
            <SkeletonBox shimmerAnim={shimmerAnim} width="150px" height={12} />
          </View>
        </View>

        {/* Timeline Skeleton */}
        <View className="border-t border-[#F1EAE7] bg-white pt-[16px]">
          <View className="px-[8px]">
            <SkeletonBox shimmerAnim={shimmerAnim} width="120px" height={12} />
          </View>
        </View>

        <View className="mt-[20px] px-[8px]">
          {[1, 2, 3, 4].map((item) => (
            <View key={item} className="flex-row items-start mb-[16px]">
              <SkeletonBox shimmerAnim={shimmerAnim} width="16px" height={16} />
              <View className="ml-[12px] flex-1">
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width="60%"
                  height={14}
                />
                <View className="mt-[4px]">
                  <SkeletonBox
                    shimmerAnim={shimmerAnim}
                    width="40%"
                    height={10}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// Reusable skeleton box component
const SkeletonBox = ({
  shimmerAnim,
  width,
  height,
}: {
  shimmerAnim: Animated.Value;
  width: string | number;
  height: number;
}) => {
  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const normalizedWidth: number | `${number}%` | undefined = (() => {
    if (typeof width === "number") return width;
    if (typeof width === "string") {
      if (width.endsWith("%")) return width as `${number}%`;
      if (width.endsWith("px")) return parseInt(width, 10);
      const num = Number(width);
      return Number.isNaN(num) ? undefined : num;
    }
    return undefined;
  })();

  return (
    <Animated.View
      style={{
        opacity,
        width: normalizedWidth as any,
        height,
        backgroundColor: "#E1E9EE",
        borderRadius: 6,
      }}
    />
  );
};
