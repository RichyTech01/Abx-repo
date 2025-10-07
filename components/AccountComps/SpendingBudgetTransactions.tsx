import { View, Text, Pressable, FlatList } from "react-native";
import OreAppText from "@/common/OreApptext";
import Transactioncard from "@/common/Transactioncard";
import NoData from "@/common/NoData";

type Transaction = {
  id: string;
  amount: number | string;
  date: string;
  orderNumber: string;
};

type Props = {
  transactions: Transaction[];
};

export default function SpendingBudgetTransactions({ transactions }: Props) {
  return (
    <View className="mt-[6%] mx-[18px]">
      <View className="flex-row items-center justify-between pb-[18px]">
        <OreAppText className="text-[16px] leading-[20px] text-[#111827]">
          Transactions
        </OreAppText>
        <Pressable>
          <Text className="text-[14px] leading-[20px] text-[#374151] font-urbanist-medium">
            see all
          </Text>
        </Pressable>
      </View>
      <View className="">
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          className="flex-grow"
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Transactioncard
              TotalAmount={Number(item.amount)}
              DatePlaced={item.date}
              OrderNumber={item.orderNumber}
            />
          )}
          ListEmptyComponent={
            <View className=" justify-center items-center">
              <NoData
                title="You are yet to set your spending buget"
                subtitle="Set a spending limit to control how you spend your resources. this ensures you save and spend responsibly. "
              />
            </View>
          }
        />
      </View>
    </View>
  );
}
