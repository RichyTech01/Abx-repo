import {
  View,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import OreAppText from "@/common/OreApptext";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import CancelModalIcon from "@/assets/svgs/CancelIcon.svg";
import ApplyImmediatelyIcon from "@/assets/svgs/ApplyImeediatelyIcon.svg";
import ApplyNextMonthIcon from "@/assets/svgs/ApplyNextMonthIcon.svg";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";
import { ProductVariation } from "@/types/store";
import VariationCard from "@/common/VariationCard";
import OrderApi from "@/api/OrderApi";

type SetBillingCycleModalProps = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SetBillingCycleModal({
  value,
  setValue,
}: SetBillingCycleModalProps) {
  return (
    <Modal
      visible={value}
      onRequestClose={() => setValue(!value)}
      animationType="slide"
      transparent
    >
      <Pressable
        className="bg-[#2D222033]/20 z-50 flex-1 justify-end"
        onPress={() => setValue(false)}
      >
        <Pressable
          className="bg-white rounded-tl-[8px] rounded-tr-[18px] px-[20px] py-[24px] overflow-hidden"
          onPress={() => setValue((prev) => !prev)}
        >
          <View className="h-[6px] w-[50px] bg-[#EAECF0] rounded-[27px] mx-auto   " />

          <View className="mt-[11px]  ">
            <View className="flex-row items-center justify-between  ">
              <Text className="text-[18px] leading-[20px] text-[#181818] font-urbanist-bold   ">
                Set billing cycle
              </Text>
              <View className="rounded-full bg-[#F7F8F7] h-[32px] w-[32px] items-center justify-center ">
                <CancelModalIcon />
              </View>
            </View>

            <Pressable className="mt-[20px]  flex-row items-center justify-between border-b border-[#F1EAE7] pb-[16px] ">
              <View className="flex-row items-center gap-[12px]   ">
                <View className="rounded-full bg-[#F2F4F7] h-[34px] w-[34px] items-center justify-center    ">
                  <ApplyImmediatelyIcon />
                </View>
                <Text className="text-[14px] leading-[20px] font-urbanist-semibold text-[#181818]  ">
                  Apply immediately
                </Text>
              </View>
              <View className="border-[2px] border-[#D0D5DD] w-[18px] h-[18px] rounded-[100px]   "></View>
            </Pressable>

            <Pressable className=" flex-row items-center justify-between  py-[16px] ">
              <View className="flex-row items-center gap-[12px]   ">
                <View className="rounded-full bg-[#F2F4F7] h-[34px] w-[34px] items-center justify-center    ">
                  <ApplyNextMonthIcon />
                </View>
                <Text className="text-[14px] leading-[20px] font-urbanist-semibold text-[#181818]  ">
                  Apply next month
                </Text>
              </View>
              <View className="border-[2px] border-[#0C513F] w-[18px] h-[18px] rounded-[100px] items-center justify-center ">
                <View className="bg-[#0C513F] h-[8px] w-[8px] rounded-[100px]  " />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
