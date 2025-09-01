import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import ImageIcon from "@/assets/svgs/Image.svg";
import ArrowRight from "@/assets/svgs/DoubleArrowRight.svg";
import Button from "@/common/Button";

export default function RescueAndSave() {
  const router = useRouter();
  return (
    <View>
      <View className="mx-[20px]  mt-[]">
        <View className="bg-[#EDF2EE] px-[22px] py-[16px] rounded-[16px] ">
          <View className="flex-row items-center ">
            <View>
              <ImageIcon />
            </View>
            <View className="ml-[24px] flex-1 ">
              <Text className="text-[#2D2220] font-orelega  text-[20px] leading-[28px] ">
                Rescue & Save:{" "}
                <Text className="text-[20px] leading-[28px] font-orelega text-[#FF8A00]  ">
                  60% Off!
                </Text>
              </Text>
              <Text className="text-[#2D2220]  text-[14px] leading-[20px] font-urbanist mt-[8px]  ">
                Reduce waste & save 60%! Grab yours before it&apos;s gone!
              </Text>
            </View>
          </View>

          <View className="mt-[18px]  ">
            <Button
              title="Click to start shopping"
              icon={<ArrowRight />}
              onPress={() =>
                router.push("/Screens/AccountScreen/RescueAndSave")
              }
              iconPosition="right"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
