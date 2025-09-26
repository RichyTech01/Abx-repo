import { View, ScrollView, Text, Pressable } from "react-native";
import { useEffect, useState, useMemo } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import Button from "@/common/Button";
import { useUserStore } from "@/store/useUserStore";
import ChangeAddressModal from "@/Modals/ChangeAddressModal";
import DefaultIcon from "@/assets/svgs/DefaultIcon.svg";
import EditIcon from "@/assets/svgs/EditIcon";

export default function ChangeAddressScreen() {
  const { user, fetchUser } = useUserStore();
  const [showModal, setShowModal] = useState(false);

  const defaultAddress = useMemo(() => {
    if (user?.address?.length) {
      return (
        user.address.find((addr: any) => addr.default_addr) || user.address[0]
      );
    }
    return null;
  }, [user]);

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  return (
    <ScreenWrapper>
      <Header title="My Address" />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          marginHorizontal: 30,
          marginTop: "5%",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-[8px] p-[18px] ">
          <Text className="text-[16px] font-urbanist-bold text-[#2D2220] leading-[22px]   ">
            Angela Thriving
          </Text>
          <View className="mt-[16px]  ">
            <Text className="text-[12px] leading-[16px] text-[#7D7D7D] font-urbanist-medium  ">
              Flat 3b, Westin, United Kingdom
            </Text>
            <Text className="text-[12px] leading-[16px] text-[#7D7D7D] font-urbanist-medium my-[8px] ">
              Westin
            </Text>
            <Text className="text-[12px] leading-[16px] text-[#7D7D7D] font-urbanist-medium  ">
              ALT 40986
            </Text>
            <Text className="text-[12px] leading-[16px] text-[#7D7D7D] font-urbanist-medium mt-[8px] ">
              +444 098 8930
            </Text>
          </View>
          <View className="flex-row items-center justify-between ">
            <View className="flex-row items-center gap-[8px]  ">
              <DefaultIcon />
              <Text className="text-[12px] leading-[16px] text-[#05A85A] font-urbanist-semibold  ">
                Default Address
              </Text>
            </View>
            <Pressable
              className=" w-9 h-9 items-end justify-center"
              onPress={() => setShowModal(true)}
            >
              <EditIcon />
            </Pressable>
          </View>
        </View>

        <View className="bg-white rounded-[8px] p-[18px] mt-[10px]">
          <Text className="text-[16px] font-urbanist-bold text-[#2D2220] leading-[22px]   ">
            Angela Thriving
          </Text>
          <View className="mt-[16px]  ">
            <Text className="text-[12px] leading-[16px] text-[#7D7D7D] font-urbanist-medium  ">
              Flat 3b, Westin, United Kingdom
            </Text>
            <Text className="text-[12px] leading-[16px] text-[#7D7D7D] font-urbanist-medium my-[8px] ">
              Westin
            </Text>
            <Text className="text-[12px] leading-[16px] text-[#7D7D7D] font-urbanist-medium  ">
              ALT 40986
            </Text>
            <Text className="text-[12px] leading-[16px] text-[#7D7D7D] font-urbanist-medium mt-[8px] ">
              +444 098 8930
            </Text>
          </View>
          <View className="flex-row items-center justify-between ">
            <Text className="text-[12px] leading-[16px] text-[#F4B551] font-urbanist-semibold  " onPress={() => console.log("set as default function")}>
              Set As Default 
            </Text>

            <Pressable
              className=" w-9 h-9 items-end justify-center"
              onPress={() => setShowModal(true)}
            >
              <EditIcon stroke={"#F4B551"}/>
            </Pressable>
          </View>
        </View>

        <View className="mt-[16px]">
          <Button
            title="Add new address"
            onPress={() => setShowModal(true)}
            paddingVertical={10}
            borderWidth={0}
          />
        </View>
      </ScrollView>

      <ChangeAddressModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => {
          fetchUser();
          setShowModal(false);
        }}
        defaultAddress={defaultAddress}
      />
    </ScreenWrapper>
  );
}

/* <View className="bg-white py-[16px] px-[24px] mt-[10%] mx-[24px] rounded-lg">
          <View className="gap-[16px]">
            <Text className="font-urbanist-semibold text-[16px] leading-[22px] text-[#2D2220]  ">
              Default Address
            </Text>
            <CustomTextInput
              label="Post code"
              value={defaultAddress?.post_code || ""}
              editable={false}
            />
            <CustomTextInput
              label="City"
              value={defaultAddress?.city || ""}
              editable={false}
            />
            <CustomTextInput
              label="Home Address"
              value={defaultAddress?.addr || ""}
              editable={false}
            />
          </View>

         
        </View> */
