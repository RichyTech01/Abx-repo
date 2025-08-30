import { SafeAreaView, FlatList, View, Platform } from "react-native";
import OreAppText from "@/common/OreApptext";
import CategoryProduct from "@/common/CategoryProduct";
import CategoryImg from "@/assets/svgs/CategoryProduct.svg";




const products = [
  {
    id: "1",
    name: "Onion",
    price: "€14.99 - €19.99",
    rating: 4.5,
    sizes: 4,
    image: <CategoryImg />,
  },
  {
    id: "2",
    name: "Fresh Apples",
    price: "€4.99 / kg",
    rating: 4,
    sizes: 2,
    image: <CategoryImg />,
  },
  {
    id: "3",
    name: "Organic Bananas",
    price: "€3.50 / bunch",
    rating: 5,
    sizes: 3,
    image: <CategoryImg />,
  },
  {
    id: "4",
    name: "Tomatoes",
    price: "€2.99 / 500g",
    rating: 3,
    sizes: 2,
    image: <CategoryImg />,
  },
  {
    id: "5",
    name: "Carrots",
    price: "€2.49 / kg",
    rating: 4,
    sizes: 3,
    image: <CategoryImg />,
  },
];

export default function AboutStore({id}:{id: number}) {

   
  return (
    <View>
      <OreAppText className="text-[16px] leading-[20px] text-[#2D2220] mx-auto my-[24px]  ">
        Available food items in store
      </OreAppText>

      <View>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          renderItem={({ item }) => (
            <View style={{ width: "48%" }}>
              <CategoryProduct
                // image={item.image}
                name={item.name}
                price={item.price}
                rating={item.rating}
                sizes={item.sizes}
              />
            </View>
          )}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}
