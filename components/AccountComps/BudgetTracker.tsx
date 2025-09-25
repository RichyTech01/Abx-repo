
// BudgetTracker.tsx
import React from "react";
import { View, Text } from "react-native";
import { Svg, Circle, G } from "react-native-svg";

type Transaction = {
  id?: string;
  date: string;
  status: string;
  amount: string;
};

type BudgetTrackerProps = {
  spent: string | undefined;
  budget: string | undefined;
  transactions?: Transaction[];
};

const BudgetTracker = ({ spent, budget, transactions = [] }: BudgetTrackerProps) => {
  const spentNum = Number(spent) || 0;
  const budgetNum = Number(budget) || 1;
  const leftToSpend = budgetNum - spentNum;

  // Predefined color pairs (chart color, background color)
  const colorPalette = [
    { chart: "#1570FF", bg: "#D0E2FF" },
    { chart: "#FF7077", bg: "#FAE5E7" },
    { chart: "#9E6FF7", bg: "#F3EDFE" },
    { chart: "#FDAC62", bg: "#FEF3E8" },
  ];

  // Generate random color pair
  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const chartColor = `hsl(${hue}, 70%, 60%)`;
    const bgColor = `hsl(${hue}, 70%, 90%)`;
    return { chart: chartColor, bg: bgColor };
  };

  // Sort transactions by amount (highest first) and assign colors
  const sortedTransactions = [...transactions]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .map((transaction, index) => {
      const colorPair = index < colorPalette.length 
        ? colorPalette[index] 
        : generateRandomColor();
      
      return {
        ...transaction,
        percentage: (Number(transaction.amount) / budgetNum) * 100,
        colorPair,
      };
    });

  // Chart configuration
  const size = 186;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const CircularProgress = () => {
    let currentOffset = 0;

    return (
      <Svg width={size} height={size}>
        <G rotation="135" origin={`${size / 2}, ${size / 2}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EFEFEF"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress segments for each transaction */}
          {sortedTransactions.map((transaction, index) => {
            const segmentLength = (transaction.percentage / 100) * circumference;
            const strokeDasharray = `${segmentLength} ${circumference - segmentLength}`;
            const strokeDashoffset = -currentOffset;

            currentOffset += segmentLength;

            return (
              <Circle
                key={transaction.id || index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={transaction.colorPair.chart}
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
              €{spentNum.toLocaleString()}
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