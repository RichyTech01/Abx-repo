import { Animated, View, Easing  } from "react-native";
import { useEffect, useRef } from "react";
import Svg, { Circle } from 'react-native-svg';


export const LoadingSpinner = ({ size = 30, color = '#346E5F', strokeWidth = 3 }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference * 0.75; // 25% of circle

  return (
    <View className="items-center justify-center">
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeDasharray} ${circumference}`}
            strokeLinecap="round"
            fill="transparent"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

