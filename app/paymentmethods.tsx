import { BASE_URL } from '@/hooks/api';
import { useUserData } from '@/hooks/useUserData';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import Button from '../components/Button';
import Header from '../components/Header';
import PaymentMethodItem from '../components/PaymentMethodItem';
import { COLORS, SIZES, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
const PaymentMethods = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { colors, dark } = useTheme();
  const userData = useUserData();
//const [categoryId, setCategoryId] = useState<string | null>(null);

     const route = useRoute<ScreenBRouteProp>();
          const { categoryId } = route.params || {};
  useEffect(() => {

   
}, []);
  // Toggle checkbox selection
  const handleCheckboxPress = (itemTitle: string) => {
    setSelectedItem((prev) => (prev === itemTitle ? null : itemTitle));
  };

  // Handle placing the order
  const handlePlaceOrder = async () => {
 
    if (!selectedItem) {
      Alert.alert('Please select a payment method.');
      return;
    }

    const productData = {
      userid: userData?.userId, // You can replace this with dynamic user ID
      paymentmethod: selectedItem,
      catid: categoryId,
    };
  console.log(productData);
    try {
      const response = await fetch(`${BASE_URL}/productorderplace.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order placed:', result);

        // Navigate to the success screen
        navigation.navigate("paymentsuccess");
      } else {
        Alert.alert('Error', 'Failed to place order.');
        console.log('Server error:', response.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.primary }]}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <Header textColor='#ffffff' title="Payment Methods" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: COLORS.white, fontWeight: '600' }]}>
            Select the payment method you want to use.
          </Text>

          <PaymentMethodItem
            checked={selectedItem === '1'}
            onPress={() => handleCheckboxPress('1')}
            title="Paypal"
            icon={icons.paypal}
          />
          <PaymentMethodItem
            checked={selectedItem === '2'}
            onPress={() => handleCheckboxPress('2')}
            title="Google Pay"
            icon={icons.google}
          />
          <PaymentMethodItem
            checked={selectedItem === '3'}
            onPress={() => handleCheckboxPress('3')}
            title="Apple Pay"
            icon={icons.apple}
            tintColor={dark ? COLORS.white : COLORS.black}
          />
          <PaymentMethodItem
            checked={selectedItem === '4'}
            onPress={() => handleCheckboxPress('4')}
            title="•••• •••• •••• •••• 4679"
            icon={icons.creditCard}
          />

          <Button
            title="Add New Card"
            onPress={() => navigation.navigate("addnewcard")}
            style={{
              width: SIZES.width - 32,
              borderRadius: 32,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
          />
        </ScrollView>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>

          {/* Continue Button */}
          <Button
            title="Continue"
            color={COLORS.dark3}
            textColor={COLORS.primary}
            
            style={styles.continueBtn}
            onPress={handlePlaceOrder}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    marginVertical: 32,
  },
  continueBtn: {
    position: "absolute",
    bottom: 16,
    color: COLORS.black2,
    //right: 16,
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.tertiaryWhite,
    shadowColor: 'rgba(4, 6, 15, 0.44)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});

export default PaymentMethods;
