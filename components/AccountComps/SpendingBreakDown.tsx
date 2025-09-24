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

;

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

      <View className="bg-white rounded-[18px] mt-[16px]  px-[20px] py-[5px]   ">
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          scrollEnabled={false }
          renderItem={({ item, index }) => (
            <View
              className={`py-[15px] shadow-sm ${
                index === transactions.length - 1 ? "" : "border-b border-[#F2F4F7]"
              }`}
              style={{ shadowColor: "#0000000D", elevation: 2 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-[12px]">
                  <View className="bg-[#F3EDFE] rounded-full h-[32px] w-[32px] items-center justify-center ">
                    <SpenidingLimitHistoryicon />
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
                  €{item.amount}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
