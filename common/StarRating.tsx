import React from "react";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface StarRatingProps {
  rating: number;       
  max?: number;         
  size?: number;      
  color?: string;    
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 12,
  color = "#FF8A00",
}) => {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name={i <= rating ? "star" : "star-o"}
        size={size}
        color={color}
        style={{ marginRight: 2 }}
      />
    );
  }

  return <View style={{ flexDirection: "row", marginTop: 4 }}>{stars}</View>;
};

export default StarRating;
