import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface CategoryProps {
  name: string;
  image: ImageSourcePropType;
  backgroundColor: string;
  onPress?: () => void  | null;
}

const Category: React.FC<CategoryProps> = ({ name, image, backgroundColor, onPress }) => {
  const { dark } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.iconContainer, { backgroundColor }]}
      >
                
        <Image
          source={{ uri: image || 'https://via.placeholder.com/150' }}
          resizeMode="contain"
          style={styles.icon}
        />
      </TouchableOpacity>
      <Text style={[styles.name, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
    width: (SIZES.width - 32) / 4,
  },
  iconContainer: {
    width: 66,
    height: 66,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 14,
    fontFamily: 'semibold',
    color: COLORS.black,
  },
});

export default Category;
