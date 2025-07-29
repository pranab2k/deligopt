import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from '../constants';

// Define the prop types
interface RatingProps {
  color: string;
  size?: number;  // size is optional, defaults to 30 if not provided
}

const Rating: React.FC<RatingProps> = ({ color, size = 30 }) => {
  const [rating, setRating] = useState<number>(0);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const renderRatingIcons = () => {
    const maxRating = 5;
    const ratingIcons = [];

    for (let i = 1; i <= maxRating; i++) {
      const iconName = i <= rating ? 'star' : 'staro';

      ratingIcons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRating(i)}
          style={styles.iconContainer}
        >
          <AntDesign name={iconName} size={size} color={color} />
        </TouchableOpacity>
      );
    }

    return ratingIcons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingIcons}>{renderRatingIcons()}</View>
      {/* <Text style={styles.ratingText}>{rating} / 5</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16
  },
  ratingIcons: {
    flexDirection: 'row',
  },
  iconContainer: {
    margin: 5,
  },
  ratingText: {
    fontFamily: "medium",
    fontSize: 20,
    marginLeft: 10,
    color: COLORS.primary
  },
});

export default Rating;
