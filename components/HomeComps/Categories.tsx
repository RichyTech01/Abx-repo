import { View, ScrollView } from "react-native";
import React from "react";
import SectionHeader from "@/common/SectionHeader";
import Succesicon from "@/assets/svgs/VeriModalIcon.svg";
import CategoryCard from "@/common/Categorycard";
import { useRouter } from "expo-router";
const categories = [
  {
    id: 1,
    title: "Fresh produce",
    subtitle: "Tomatoes, Onion, Pepper, etc.",
    bgColor: "#ECF1F0",
    borderColor: "#5D8B7F",
    Icon: <Succesicon />,
  },
  {
    id: 2,
    title: "Bakery",
    subtitle: "Bread, Cakes, Pastries",
    bgColor: "#FFF4E6",
    borderColor: "#E6A14A",
    Icon: <Succesicon />,
  },
  {
    id: 3,
    title: "Beverages",
    subtitle: "Juice, Soda, Water",
    bgColor: "#E6F2FF",
    borderColor: "#4A90E2",
    Icon: <Succesicon />,
  },
  {
    id: 4,
    title: "Snacks",
    subtitle: "Chips, Biscuits, Chocolates",
    bgColor: "#FDE6F2",
    borderColor: "#D14A78",
    Icon: <Succesicon />,
  },
];

export default function Categories() {

    const router =  useRouter()  

  return (
    <View>
      <SectionHeader title="Categories" onPress={() => router.push("/")} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 8, paddingHorizontal: 20 }}
      >
        {categories.map((item) => (
          <CategoryCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            bgColor={item.bgColor}
            borderColor={item.borderColor}
            Icon={item.Icon}
          />
        ))}
      </ScrollView>
    </View>
  );
}
