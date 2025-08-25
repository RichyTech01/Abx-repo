import { View, Text, Modal, Pressable } from "react-native";
import OreAppText from "@/common/OreApptext";
import CancelModalIcon from "@/assets/svgs/CancelModalIcon.svg";
import UrbanistText from "@/common/UrbanistText";
import AddtoCartIcon from "@/assets/svgs/AddToCartIcon.svg";
import Button from "@/common/Button";

type AddtoCartModalProps = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddtoCartModal({
  value,
  setValue,
}: AddtoCartModalProps) {
  return (
    <Modal
      visible={value}
      onRequestClose={() => setValue(!value)}
      animationType="slide"
      transparent
    >
      <Pressable className="bg-[#2D222033]/20 z-50 flex-1 justify-end">
        <Pressable
          className="flex-1 "
          onPress={() => setValue(!value)}
        ></Pressable>
      </Pressable>

      <View className="bg-white rounded-tl-[8px] rounded-tr-[8px]  px-[20px] py-[30px] ">
        <View className="flex-row items-center justify-between">
          <OreAppText className="text-[#424242] text-[20px] leading-[28px]   ">
            Available Options
          </OreAppText>
          <Pressable onPress={() => setValue(!value)}>
            <CancelModalIcon />
          </Pressable>
        </View>

        <UrbanistText
          className="text-[16px] leading-[22px] text-[#424242] mt-[20px] mb-[24px]   "
          style={{ fontFamily: "UrbanistSemiBold" }}
        >
          Add to cart
        </UrbanistText>

        <View>
          <View className="border border-[#F1EAE7] rounded-[8px] px-[15px] py-[4px] flex-row items-center justify-between">
            <View className="flex-row items-center gap-[16px]  ">
              <View className="bg-black/30 w-[60px] h-[52px] rounded-[4px]  "></View>
              <View>
                <UrbanistText className="text-[14px] leading-[20px] text-[#424242]  ">
                  Ikg
                </UrbanistText>
                <UrbanistText
                  className="text-[14px] leading-[20px] text-[#2D2220]   "
                  style={{ fontFamily: "UrbanistSemiBold" }}
                >
                  €14.99{" "}
                </UrbanistText>
              </View>
            </View>
            <View className="flex-row items-center   ">
              <View className="w-[35px] h-[35px] rounded-[8px] bg-[#86A89F] items-center justify-center ">
                <View className="bg-white h-[2px] w-[11.67px] " />
              </View>
              <UrbanistText
                className="text-[#424242] text-[14px] leading-[20px] px-[10px]  "
                style={{ fontFamily: "UrbanistSemiBold" }}
              >
                0
              </UrbanistText>
              <View className="w-[35px] h-[35px] rounded-[8px] bg-[#0C513F] items-center justify-center  ">
                <AddtoCartIcon />
              </View>
            </View>
          </View>

          <View className="mt-[47px] gap-[20px] *  ">
            <Button
              title="Proceed to checkout"
              variant="outline"
              onPress={() => {}}
            />
            <Button title="Continue shopping" onPress={() => {}} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
