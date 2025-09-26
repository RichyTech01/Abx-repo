import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface StarRatingProps {
  rating: number;                    // Your original prop (required)
  max?: number;                      // Your original prop
  size?: number;                     // Your original prop  
  color?: string;                    // Your original prop
  unfilledColor?: string;            // Optional - color for unfilled stars
  gap?: number;                      // Optional - gap between stars
  onRatingChange?: (rating: number) => void;  // Optional - makes it clickable
  disabled?: boolean;                // Optional
  interactive?: boolean;             // Optional - manual override
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 12,
  color = "#FF8A00",
  unfilledColor,                     // Optional unfilled color
  gap = 2,                           // Default 2px gap
  onRatingChange,
  disabled = false,
  interactive,
}) => {
  const [internalRating, setInternalRating] = useState(rating);
  
  // Auto-detect if component should be interactive
  const isInteractive = interactive !== undefined 
    ? interactive 
    : onRatingChange !== undefined;
  
  // Use external rating by default, internal only when interactive
  const displayRating = isInteractive ? internalRating : rating;
  
  // Generate unfilled color if not provided (lighter version of main color)
  const getUnfilledColor = () => {
    if (unfilledColor) return unfilledColor;
    
    // Convert hex to lighter version
    if (color.startsWith('#')) {
      return color + '95'; // Add 40 for ~25% opacity
    }
    return '#D1D5DB'; // Fallback gray
  };
  
  const unfilledStarColor = getUnfilledColor();
  
  // Sync internal rating with external rating
  useEffect(() => {
    setInternalRating(rating);
  }, [rating]);
  
  const handleStarPress = (starValue: number) => {
    if (disabled || !isInteractive) return;
    
    setInternalRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const stars = [];

  for (let i = 1; i <= max; i++) {
    const StarComponent = isInteractive && !disabled ? TouchableOpacity : View;
    const starProps = isInteractive && !disabled 
      ? { onPress: () => handleStarPress(i) }
      : {};

    stars.push(
      <StarComponent
        key={i}
        {...starProps}
        style={{ marginRight: i === max ? 0 : gap }} 
      >
        <FontAwesome
          name={i <= displayRating ? "star" : "star-o"}
          size={size}
          color={i <= displayRating ? color : unfilledStarColor}
        />
      </StarComponent>
    );
  }

  return <View style={{ flexDirection: "row", marginTop: 4 }}>{stars}</View>;
};

export default StarRating;

