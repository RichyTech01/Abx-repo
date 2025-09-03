import { Text, Modal, Pressable, View } from "react-native";
import { LoadingSpinner } from "@/common/LoadingSpinner";

type PaymentRedirectingModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function PaymentRedirectingModal({
  visible,
  onClose,
}: PaymentRedirectingModalProps) {

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/30"
        onPress={onClose}
      >
        <Pressable
          className="w-[80%] bg-white py-[25px] rounded-[16px] border border-[#F1EAE7] items-center"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-[80%]">
            <LoadingSpinner />
            <Text className="text-[16px] leading-[20px] font-orelega text-[#2D2220] text-center mt-[24px]">
              Redirecting you to stripe to make your payment
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
