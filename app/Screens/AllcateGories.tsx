import { View, SafeAreaView, FlatList } from "react-native";
import Header from "@/common/Header";
import CategoryCard from "@/common/Categorycard";
import Succesicon from "@/assets/svgs/VeriModalIcon.svg";

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
    bgColor: "#DDE5FF",
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
  {
    id: 5,
    title: "Frozen",
    subtitle: "Meat, Ice cream, etc.",
    bgColor: "#E8F8F5",
    borderColor: "#48C9B0",
    Icon: <Succesicon />,
  },
  {
    id: 6,
    title: "Dairy",
    subtitle: "Milk, Cheese, Yogurt",
    bgColor: "#FDF0DC",
    borderColor: "#F4D03F",
    Icon: <Succesicon />,
  },
  {
    id: 7,
    title: "Household",
    subtitle: "Detergent, Cleaners",
    bgColor: "#FDF0DC",
    borderColor: "#8E44AD",
    Icon: <Succesicon />,
  },
  {
    id: 8,
    title: "Canned Goods",
    subtitle: "Beans, Soups, Corn",
    bgColor: "#FDEDEC",
    borderColor: "#C0392B",
    Icon: <Succesicon />,
  },
  {
    id: 9,
    title: "Personal Care",
    subtitle: "Soap, Shampoo, etc.",
    bgColor: "#EBF5FB",
    borderColor: "#2980B9",
    Icon: <Succesicon />,
  },
];

export default function AllCategories() {
  return (
    <SafeAreaView className="bg-[#FFF6F2] flex-1">
      <Header title="All categories" />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 42,
          paddingBottom: 20,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 24,
        }}
        renderItem={({ item, index }) => {
          const isLast = index === categories.length - 1;
          return (
            <View
              style={{
                width: isLast ? "100%" : "48%",
                alignItems: isLast ? "center" : "flex-start",
              }}
            >
              <CategoryCard
                bgColor={item.bgColor}
                borderColor={item.borderColor}
                Icon={item.Icon}
                title={item.title}
                subtitle={item.subtitle}
                width={180}
                paddingY={10}
              />
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
