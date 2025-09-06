import { View, Text, Pressable } from "react-native";
import OreAppText from "@/common/OreApptext";
import Transactioncard from "@/common/Transactioncard";

export default function SpendingBudgetTransactions() {
  return (
    <View className="mt-[8%] mx-[18px]   ">
      <View className="flex-row items-center justify-between pb-[18px]  ">
        <OreAppText className="text-[16px] leading-[20px] text-[#111827] ">
          Transactions
        </OreAppText>
        <Pressable>
          <Text className="text-[14px] leading-[20px] text-[#374151] font-urbanist-medium  ">
            see all
          </Text>
        </Pressable>
      </View>

      <Transactioncard
        TotalAmount={160.0}
        DatePlaced={"Jul 6, 2025"}
        OrderNumber={"WU88191111"}
      />
    </View>
  );
}
