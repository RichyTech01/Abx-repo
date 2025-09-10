import React from "react";
import { View, Text } from "react-native";
import { Svg, Circle, G } from "react-native-svg";

const BudgetTracker = () => {
  const totalBudget = 6000;
  const spent = 2335.2;
  const leftToSpend = totalBudget - spent;

  // Chart configuration
  const size = 186;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Chart segments - you can make this dynamic based on spending categories
  const segments = [
    { percentage: 35, color: "#8B5CF6" }, // Purple
    { percentage: 15, color: "#F59E0B" }, // Orange
    { percentage: 25, color: "#EF4444" }, // Red/Pink
    { percentage: 25, color: "#3B82F6" }, // Blue
  ];

  const CircularProgress = () => {
    let currentOffset = 0;

    return (
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress segments */}
          {segments.map((segment, index) => {
            const segmentLength = (segment.percentage / 100) * circumference;
            const strokeDasharray = `${segmentLength} ${circumference - segmentLength}`;
            const strokeDashoffset = -currentOffset;

            currentOffset += segmentLength;

            return (
              <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
              />
            );
          })}
        </G>
      </Svg>
    );
  };

  return (
    <View className="items-center">
      {/* Chart Section */}
      <View className="mb-[24px]">
        <View className="relative items-center justify-center">
          <CircularProgress />
          <View className="absolute items-center justify-center">
            <Text className="text-[18px] leading-[21px] font-urbanist-bold text-[#181818]">
              €{spent.toLocaleString()}
            </Text>
            <Text className="text-[14px] leading-[21px] text-[#929292] font-urbanist-semibold">
              Spent
            </Text>
          </View>
        </View>
      </View>

      {/* Remaining Budget */}
      <View className="flex-row items-center gap-[4px]">
        <Text className="text-[14px] font-urbanist-bold leading-[21px] text-[#181818]">
          Left to spend:
        </Text>
        <View className="py-[6px] px-[12px] bg-[#FDF0DC] rounded-[32px]">
          <Text className="text-[13px] leading-[21px] text-[#2D2220] font-urbanist-bold">
            €{leftToSpend.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BudgetTracker;