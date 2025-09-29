import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import Button from "@/common/Button";
import { useUserStore } from "@/store/useUserStore";
import ChangeAddressModal from "@/Modals/ChangeAddressModal";
import AddressCard from "@/common/AddressCard";  

export default function ChangeAddressScreen() {
  const { user, fetchUser } = useUserStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <Header title="My Address" />

        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={{
            flexDirection: "column-reverse",
            paddingBottom: 20,
            marginHorizontal: 30,
            marginTop: "5%",
          }}
          showsVerticalScrollIndicator={false}
        >
          {user?.address?.map((addr: any) => (
            <AddressCard
              key={addr.id}
              name={
                `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
                "Unnamed"
              }
              addr={addr.addr}
              city={addr.city}
              post_code={addr.post_code}
              phone={user.phone_number}
              isDefault={addr.default_addr}
              onEdit={() => setShowModal(true)}
              onSetDefault={() => console.log("set as default", addr.id)}
            />
          ))}
        </ScrollView>

        {/* Sticky bottom button */}
        <View style={{ padding: 16 }}>
          <Button
            title="Add new address"
            onPress={() => setShowModal(true)}
            paddingVertical={10}
            borderWidth={0}
          />
        </View>
      </View>

      <ChangeAddressModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSaved={() => {
          fetchUser();
          setShowModal(false);
        }}
        defaultAddress={user?.address?.find((a: any) => a.default_addr) || null}
      />
    </ScreenWrapper>
  );
}
