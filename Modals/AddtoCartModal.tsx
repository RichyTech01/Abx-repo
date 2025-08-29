import {
  View,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import OreAppText from "@/common/OreApptext";
import CancelModalIcon from "@/assets/svgs/CancelModalIcon.svg";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";
import { ProductVariation } from "@/types/store";
import VariationCard from "@/common/VariationCard";

type AddtoCartModalProps = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  data: ProductVariation[];
  loading: boolean;
};

export default function AddtoCartModal({
  value,
  setValue,
  data,
  loading,
}: AddtoCartModalProps) {
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
          className="bg-white rounded-tl-[8px] rounded-tr-[8px] px-[20px] py-[30px] overflow-hidden"
          onPress={() => {}}
        >
          {/* header */}
          <View className="flex-row items-center justify-between">
            <OreAppText className="text-[#424242] text-[20px] leading-[28px]">
              Available Options
            </OreAppText>
            <Pressable onPress={() => setValue(false)}>
              <CancelModalIcon />
            </Pressable>
          </View>

          <UrbanistText
            className="text-[16px] leading-[22px] text-[#424242] mt-[20px] mb-[24px]"
            style={{ fontFamily: "UrbanistSemiBold" }}
          >
            Add to cart
          </UrbanistText>

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <View style={{ maxHeight: 300 }}>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <VariationCard item={item} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          <View className="mt-[20px] gap-[20px]">
            <Button
              title="Proceed to checkout"
              variant="outline"
              onPress={() => {}}
            />
            <Button title="Continue shopping" onPress={() => {}} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
