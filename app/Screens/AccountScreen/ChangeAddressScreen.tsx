import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import ScreenWrapper from "@/common/ScreenWrapper";
import Header from "@/common/Header";
import Button from "@/common/Button";
import { useUserStore } from "@/store/useUserStore";
import ChangeAddressModal from "@/Modals/ChangeAddressModal";
import AddressCard from "@/common/AddressCard";
import NoData from "@/common/NoData";
import { useRouter } from "expo-router";

export default function ChangeAddressScreen() {
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  const hasAddresses = user?.address && user.address.length > 0;

  const handleAddAddress = async () => {
    setShowAddressModal(true);
  };

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <Header title="My Address" />

        {/* Scrollable content */}
        {hasAddresses ? (
          <ScrollView
            contentContainerStyle={{
              flexDirection: "column-reverse",
              paddingBottom: 20,
              marginHorizontal: 30,
              marginTop: "5%",
            }}
            showsVerticalScrollIndicator={false}
          >
            {user?.address.map((addr: any) => (
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
        ) : (
          <View style={{ flex: 1 }} className="mt-5">
            <NoData
              title="No saved addresses"
              subtitle="You haven't added any addresses yet. Add one now to make checkout faster!"
              buttonTitle="Add new address"
              onButtonPress={handleAddAddress}
            />
          </View>
        )}

        <View style={{ padding: 16 }}>
          <Button
            title="Add new address"
            onPress={handleAddAddress}
            paddingVertical={10}
            borderWidth={0}
          />
        </View>
      </View>

      <ChangeAddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSaved={() => {
          fetchUser();
          setShowAddressModal(false);
        }}
        defaultAddress={user?.address?.find((a: any) => a.default_addr) || null}
      />
    </ScreenWrapper>
  );
}
