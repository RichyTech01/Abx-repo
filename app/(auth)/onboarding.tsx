import { useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  Platform
} from "react-native";
import Button from "@/common/Button";
import { useRouter } from "expo-router";

type Slide = {
  id: string;
  image: any;
};

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("@/assets/Images/Frame 1000008335.png"),
  },
  {
    id: "2",
    image: require("@/assets/Images/onboarding2.png"),
  },
  {
    id: "3",
    image: require("@/assets/Images/onboarding3.png"),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <Image source={item.image} alt="img" style={styles.image} />
    </View>
  );

  return (
    <SafeAreaView className="bg-white flex-1 ">
      <FlatList
        maxToRenderPerBatch={1}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        ref={flatListRef}
      />

      {/* Pagination Dots */}
      <View style={styles.dots}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>

      <View className="flex-col items-center justify-between mb-[15%] mx-[20px] ">
        <View className="w-full ">
          <Button
            title="Create Account"
            variant="solid"
            onPress={() => router.push("/createAccountSteps/CreateAccount")}
          />
        </View>
        <View className="w-full mt-[24px]  ">
          <Button
            title="Log into your account"
            variant="outline"
            onPress={() => router.push("/Login")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: width * 0.9,
    height: width * 1.2,
    resizeMode: "contain",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
    bottom:Platform.OS === "android"?"7%": "6%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D7D7D7",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#0C513F",
  },
});
