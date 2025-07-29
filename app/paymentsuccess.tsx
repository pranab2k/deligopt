import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react'; // ✅ Make sure useEffect is imported!
import { BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const PaymentSuccess = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      // Returning true disables the default back behavior.
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.primary }]}>
      <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={styles.logoIcon}
            />
            <Text style={[styles.driverTitle, { color: COLORS.white }]}>
              Payment Done Successfully
            </Text>
          </View>
        </ScrollView>

        <View style={styles.slideBtnView}>
          <TouchableOpacity
            onPress={() => router.push('/orders')}
            style={styles.slideBtn}
          >
            <Text style={styles.slideText}>{'>>'} My Order</Text>
          </TouchableOpacity>
          </View>
           <View style={styles.slideBtnView}>
          <TouchableOpacity
            onPress={() => router.push('/')}
            style={styles.slideBtn}
          >
            <Text style={styles.slideText}>{'>>'} Back To Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  contentContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  logoIcon: {
    height: 64,
    width: 64,
  },
  driverTitle: {
    fontSize: 20,
    fontFamily: 'semiBold',
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 12,
  },
  driverSubtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.grayscale700,
    textAlign: 'center',
  },
  view1: {
    width: SIZES.width - 64,
    height: SIZES.width - 64,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 172, 75, 0.08)',
    marginVertical: 22,
  },
  view2: {
    width: SIZES.width - 96,
    height: SIZES.width - 96,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 172, 75, 0.12)',
  },
  view3: {
    width: SIZES.width - 112,
    height: SIZES.width - 112,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 172, 75, 0.2)',
  },
  view4: {
    width: SIZES.width - 178,
    height: SIZES.width - 178,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 172, 75, 0.26)',
  },
  userAvatar: {
    height: 112,
    width: 112,
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  slideBtn: {
    backgroundColor: COLORS.primary,
    width: 178,
    height: 52,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    color: COLORS.white,
    backgroundColor: COLORS.tertiaryWhite,
    shadowColor: 'rgba(4, 6, 15, 0.44)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  slideBtnView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:30
  },
  slideCloseBtn: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideText: {
    color: COLORS.primary,
    fontFamily: 'semiBold',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 12,
  },
});

export default PaymentSuccess;
