import { View, Animated, ViewStyle } from "react-native";

type Props = {
  shimmerAnim: Animated.Value;
  style?: ViewStyle;
};

export const SkeletonCard = ({ shimmerAnim, style }: Props) => {
  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          opacity,
          height: 180,
          backgroundColor: "#E1E9EE",
          borderRadius: 12,
          marginTop: 16, 
          width:'auto'
        },
        style,
      ]}
    >
      <View
        style={{
          width: "100%",
          height: 120,
          backgroundColor: "#C4D1DA",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          marginBottom: 8,
        }}
      />
      <View style={{ paddingHorizontal: 12 }}>
        <View
          style={{
            width: "70%",
            height: 16,
            backgroundColor: "#C4D1DA",
            borderRadius: 4,
            marginBottom: 6,
          }}
        />
        <View
          style={{
            width: "50%",
            height: 12,
            backgroundColor: "#C4D1DA",
            borderRadius: 4,
          }}
        />
      </View>
    </Animated.View>
  );
};
