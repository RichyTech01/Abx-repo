import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import CustomNumericKeyboard from "@/common/CustomNumericKeyboard";
import OreAppText from "@/common/OreApptext";
import LimitDropDown from "../../../assets/svgs/LimitDropDOwn.svg";
import Button from "@/common/Button";
import SetBillingCycleModal from "@/Modals/SetBillingCycleModal";

export default function AdjustLimit() {
  const [amount, setAmount] = useState("1,500");
  const [ShowModal, setShowModal] = useState(true);

  return (
    <ScreenWrapper>
      <Header title="Adjust limit" />
      <View className=" mt-[60px]  mx-[20px]">
        <View className="pb-[18px] mx-auto border-b border-[#EAECF0] w-full  items-center ">
          <OreAppText className="text-[#181818] leading-[40px] text-[32px] ">
            €{amount}
          </OreAppText>
        </View>

        <View className="flex-row items-center mx-auto pt-[18px]  ">
          <Text className="text-[16px] font-urbanist-semibold leading-[21px] text-[#929292]  ">
            Current limit:
          </Text>
          <Text className="text-[16px] font-urbanist-bold leading-[22px] text-[#181818]  ">
            €18,000
          </Text>
        </View>
        <Pressable
          className="mt-[8%] bg-white px-[16px] py-[8px] rounded-[38px] flex-row items-center gap-[11.33px] mx-auto mb-[8.2%]  "
          onPress={() => setShowModal((prev) => !prev)}
        >
          <Text className="text-[14px] font-urbanist-semibold leading-[20px] text-[#181818] ">
            Apply immediately
          </Text>
          <LimitDropDown />
        </Pressable>

        <View className="  ">
          <CustomNumericKeyboard value={amount} onChange={setAmount} />
        </View>
      </View>

      <View className="mx-[20px] ">
        <Button title="Confirm limit" onPress={() => {}} />
      </View>

      <SetBillingCycleModal value={ShowModal} setValue={setShowModal} />
    </ScreenWrapper>
  );
}
