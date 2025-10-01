import { View,  } from "react-native";
import OreAppText from "@/common/OreApptext";
import UrbanistText from "@/common/UrbanistText";
import Button from "@/common/Button";
import EmptyyImg from "@/assets/svgs/EmptyStoreImg.svg";

type NoDataProps = {
  title: string;
  subtitle: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
};

export default function NoData({
  title,
  subtitle,
  buttonTitle,
  onButtonPress,
}: NoDataProps) {
  return (
   
      <View className="bg-white rounded-[8px] mx-[20px] py-[50px] px-[32px] items-center">
        <View className="items-center">
          <EmptyyImg />
          <OreAppText className="text-[#121212] text-[16px] leading-[20px] mt-[18px] text-center">
            {title}
          </OreAppText>
        </View>

        <UrbanistText className="text-[#2C2C2C] text-[12px] leading-[16px] text-center mt-[16px] ">
          {subtitle}
        </UrbanistText>

        {buttonTitle && onButtonPress && (
          <View className="mt-[24px]">
            <Button title={buttonTitle} onPress={onButtonPress} />
          </View>
        )}
      </View>
  );
}
