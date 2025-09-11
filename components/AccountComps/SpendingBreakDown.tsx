// SpendingBreakDown.tsx
import { View, Text, FlatList } from "react-native";
import NoData from "@/common/NoData";

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
        <Text className="text-[16px] font-urbanist-bold text-[#181818] ">
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

  return (
    <View className="mt-[32px]">
      <Text className="text-[16px] font-urbanist-bold text-[#181818]">
        Spending breakdown
      </Text>

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => (
          <View
            className="bg-white rounded-[18px] p-[20px] mt-[16px] shadow-sm"
            style={{ shadowColor: "#0000000D", elevation: 2 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-[12px]">
                <View className="bg-[#F3EDFE] rounded-full h-[32px] w-[32px]" />
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
                €{item.amount}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
