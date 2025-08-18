import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Onnboarding from "@/assets/svgs/OnboardingSvg";


const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Excellence at all times is what we represent",
    description:
      "Our vendors are committed to making your favorite Nigerian food item readily available.",
    image: require("@/assets/Images/Frame 1000008329.png"),
    color: "#DAEEE5"
  },
  {
    id: "2",
    title: "Fresh and Healthy",
    description:
      "Get access to organic Nigerian food items delivered to your doorstep.",
    image: require("@/assets/Images/Frame 1000008329.png"),
  },
  {
    id: "3",
    title: "Fast & Reliable",
    description: "Enjoy seamless shopping with quick delivery.",
    image: require("@/assets/Images/Frame 1000008329.png"),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace("/"); 
    }
  };

  const handleSkip = () => {
    navigation.replace("Login");
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide} >
          <Onnboarding />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Slides */}
      <FlatList
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

      <View style={styles.buttonBox}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  
  image: {
    width: width * 0.7,
    height: width * 1.2,
    resizeMode: "contain",
    marginTop: "6%",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#004d2b", // green
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  skip: { fontSize: 16, color: "#555" },
  nextButton: {
    backgroundColor: "#004d2b",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
