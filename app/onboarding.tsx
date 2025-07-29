import { COLORS, illustrations, SIZES } from '@/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { NavigationProp } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Slide {
  id: string;
  image: any;
  darkImage: any;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: '1',
    image: illustrations.food,
    darkImage: illustrations.food,
    title: 'All your favorites foods',
    subtitle: 'Get all your loved foods in one once place, you just place the orer we do the rest',
  },
  {
    id: '2',
    image: illustrations.payment,
    darkImage: illustrations.paymentDark,
    title: 'Order from choosen chef',
    subtitle: 'Order from your chosen chef. You just place the order, we do the rest.',
  },
  {
    id: '3',
    image: illustrations.delivery,
    darkImage: illustrations.delivery,
    title: 'Free delivery offers feeless',
    subtitle: ' Order from your chosen chef with no delivery fee. You just place the order, we do the rest.',
  },
];

const OnboardingScreen: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const { colors, dark } = useTheme();

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  // Update index when scroll finishes
  const onMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SIZES.width);
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      listRef.current?.scrollToOffset({ offset: SIZES.width * nextIndex, animated: true });
    } else {
      navigation.navigate('welcome');
    }
  };
  
  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <Image source={dark ? item.darkImage : item.image} style={styles.image} resizeMode="contain" />
      <Text style={[styles.title, { color: dark ? COLORS.primary : COLORS.greyscale900 }]}>{item.title}</Text>
      <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale200 : '#737373' }]}>{item.subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfig.current}
        ref={listRef}
        getItemLayout={(_, index) => ({ length: SIZES.width, offset: SIZES.width * index, index })}
      />
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.7}>
          <Text style={styles.buttonText}>{currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width: SIZES.width,
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: SIZES.width * 0.8,
    height: SIZES.height * 0.5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'bold',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    color: COLORS.greyscale900,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 30,
    color: '#737373',
    fontFamily: "medium"
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingHorizontal: 60,
    width: SIZES.width - 32,
    alignItems: "center",
    justifyContent: "center",
    height: 48
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'bold',
  },
  background: {
    zIndex: -1,
    position: "absolute",
    top: 300
  }
});

export default OnboardingScreen;