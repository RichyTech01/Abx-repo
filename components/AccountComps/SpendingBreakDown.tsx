import { View, Text, FlatList } from "react-native";
import NoData from "@/common/NoData";
import SpenidingLimitHistoryicon from "@/assets/svgs/SpenidingLimitHistoryicon";

type Transaction = {
  id?: string;
  date: string;
  status: string;
  amount: string;
};

type Props = {
  transactions: Transaction[];
};

export default function SpendingBreakDown({ transactions }: Props) {
  if (!transactions || transactions.length === 0) {
    return (
      <View className="mt-[32px]">
        <Text className="text-[16px] font-urbanist-bold text-[#181818]">
          Spending breakdown
        </Text>
        <View className="mt-2">
          <NoData
            title="No Transaction Yet"
            subtitle="Go to store and start shopping"
          />
        </View>
      </View>
    );
  }

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
      const colorPair =
        index < colorPalette.length
          ? colorPalette[index]
          : generateRandomColor();

      return {
        ...transaction,
        colorPair,
      };
    });

  return (
    <View className="mt-[32px]">
      <Text className="text-[16px] font-urbanist-bold text-[#181818]">
        Spending breakdown
      </Text>

      <View className="bg-white rounded-[18px] mt-[16px] px-[20px] py-[5px]">
        <FlatList
          data={sortedTransactions}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View
              className={`py-[15px] shadow-sm ${
                index === sortedTransactions.length - 1
                  ? ""
                  : "border-b border-[#F2F4F7]"
              }`}
              style={{ shadowColor: "#0000000D", elevation: 2 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-[12px]">
                  <View
                    className="rounded-full h-[32px] w-[32px] items-center justify-center"
                    style={{ backgroundColor: item.colorPair.bg }}
                  >
                    <SpenidingLimitHistoryicon fill={item.colorPair.chart} />
                  </View>
                  <Text className="text-[14px] font-urbanist-bold text-[#181818]">
                    {item.date}
                  </Text>
                </View>
                <View className="bg-[#DAEEE5] rounded-[8px] px-[4px] py-[2px]">
                  <Text className="text-[12px] leading-[18px] font-urbanist-medium text-[#05A85A]">
                    {item.status}
                  </Text>
                </View>
                <Text className="text-[13px] font-urbanist-bold text-[#181818]">
                  €{Number(item.amount).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
