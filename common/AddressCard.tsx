import { View, Text, Pressable } from "react-native";
import DefaultIcon from "@/assets/svgs/DefaultIcon.svg";
import EditIcon from "@/assets/svgs/EditIcon";

type AddressCardProps = {
  name: string;
  addr: string;
  city: string;
  post_code: string;
  phone?: string;
  isDefault?: boolean;
  onEdit: () => void;
  onSetDefault?: () => void;
};

export default function AddressCard({
  name,
  addr,
  city,
  post_code,
  phone,
  isDefault,
  onEdit,
  onSetDefault,
}: AddressCardProps) {
  return (
    <View className="bg-white rounded-[8px] p-[18px] mt-[10px]">
      <Text className="text-[16px] font-urbanist-bold text-[#2D2220] leading-[22px]">
        {name}
      </Text>

      <View className="mt-[16px]">
        <Text className="text-[12px] text-[#7D7D7D] font-urbanist-medium leading-[16px]">
          {addr}
        </Text>
        <Text className="text-[12px] text-[#7D7D7D] font-urbanist-medium leading-[16px] my-[8px]">
          {city}
        </Text>
        <Text className="text-[12px] text-[#7D7D7D] font-urbanist-medium leading-[16px]">
          {post_code}
        </Text>
        {phone && (
          <Text className="text-[12px] text-[#7D7D7D] font-urbanist-medium leading-[16px] mt-[8px]">
            {phone}
          </Text>
        )}
      </View>

      <View className="flex-row items-center justify-between mt-2">
        {isDefault ? (
          <View className="flex-row items-center gap-[8px]">
            <DefaultIcon />
            <Text className="text-[12px] font-urbanist-semibold text-[#05A85A] leading-[16px]">
              Default Address
            </Text>
          </View>
        ) : (
          <Pressable onPress={onSetDefault}>
            <Text className="text-[12px] font-urbanist-semibold text-[#F4B551] leading-[16px]">
              Set As Default
            </Text>
          </Pressable>
        )}

        <Pressable
          className="w-9 h-9 items-end justify-center"
          onPress={onEdit}
        >
          <EditIcon stroke={isDefault ? "#05A85A" : "#F4B551"} />
        </Pressable>
      </View>
    </View>
  );
}
