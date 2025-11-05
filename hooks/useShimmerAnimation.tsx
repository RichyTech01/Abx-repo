import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export const useShimmerAnimation = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
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
    );

    animation.start();

    // Cleanup: stop animation when component unmounts
    return () => animation.stop();
  }, []);

  return shimmerAnim;
};
