import Button from '@/components/Button';
import Header from '@/components/Header';
import OrderSummaryCard from '@/components/OrderSummaryCard';
import { COLORS, SIZES, icons } from '@/constants';
import { BASE_URL } from '@/hooks/api';
import { useUserData } from '@/hooks/useUserData';
import { useTheme } from '@/theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';

const CheckoutOrders = () => {
  interface Product {
    pid: string;
    product_image: ImageSourcePropType;
    product_name: string;
    price: string;
  }
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const [data, setData] = useState<Product[]>([]);
  const [subtotal, setSubTotal] = useState();
 const [deleveryfee, setDeleveryFee] = useState();
 const [totalamount, setTotalAmount] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const [activeAddress, setActiveAddress] = useState(null);
  const userData = useUserData();
 // const [categoryId, setCategoryId] = useState<string | null>(null);
     const route = useRoute<ScreenBRouteProp>();
          const { categoryId } = route.params || {};

const  fetchData = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/checkoutorders.php?catid=${categoryId}&userid=${userData?.userId}`);
    const json = await response.json();
    console.log(json.poductlist);
    setData(json.poductlist);
    setSubTotal(json.subtotal);
    setDeleveryFee(json.deliveryfee);
    setTotalAmount(json.totalamount);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};


 useEffect(() => {
  let isMounted = true;
  const loadActiveAddress = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('activeAddress');
      if (jsonValue != null) {
        const parsed = JSON.parse(jsonValue);
        if (isMounted) {
          setActiveAddress(parsed);
          console.log('Loaded active address:', parsed);
        }
      } else {
        console.log('No active address found in storage');
      }
    } catch (e) {
      console.error('Failed to load active address', e);
    }
  };

  // Load immediately
  loadActiveAddress();

  // Then check every 3 seconds
  const interval = setInterval(() => {
    loadActiveAddress();
  }, 3000);

  // Cleanup when unmounts
  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);
useEffect(() => {
  console.log('route.params:', route.params);
  console.log('categoryId:', categoryId);
  console.log('userData:', userData);

  if (categoryId && userData?.userId) {
    fetchData(categoryId);
  } else {
    console.warn('Missing categoryId or userId!');
  }
}, [categoryId, userData]);

 const renderItem = ({ item }) => (
    <OrderSummaryCard
      name={item.product_name}
      price={item.price}
      image={item.product_image}
      qty={item.quantity}
      onPress={() => console.log(`Clicked on ${item.product_image}`)}
    />
  );

     if (loading) {
          return (
              <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text>Loading product...</Text>
              </View>
          );
      }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.primary }]}>
      <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
        <Header textColor='#fff' title="Checkout Orders" />
        <ScrollView
          contentContainerStyle={{
            backgroundColor: dark ? COLORS.dark2 : COLORS.primary,
            marginTop: 8, padding: 6,
          }}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.summaryContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          }, { paddingHorizontal: 8 }]}>
            <Text style={[styles.summaryTitle, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Deliver To</Text>
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            }]} />
            <TouchableOpacity
              onPress={() => navigation.navigate("address")}
              style={styles.addressContainer}>
              <View style={styles.addressLeftContainer}>
                <View style={styles.view1}>
                  <View style={styles.view2}>
                    <Image
                      source={icons.location2}
                      resizeMode='contain'
                      style={styles.locationIcon}
                    />
                  </View>
                </View>
                <View style={styles.viewAddress}>
                  <View style={styles.viewView}>                 
                    <Text style={[styles.homeTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{activeAddress.you_are_here} </Text>
                   
                  </View>
                  <Text style={[styles.addressTitle, {
                    color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                  }]}>
                    {activeAddress.address_name}</Text>
                </View>
              </View>
              <Image
                source={icons.arrowRight}
                resizeMode='contain'
                style={[styles.arrowRightIcon, {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900
                }]}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.summaryContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          }]}>
            <View style={styles.orderSummaryView}>
              <Text style={[styles.summaryTitle, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>Order Summary</Text>
              <TouchableOpacity style={styles.addItemView} onPress={() => navigation.navigate("fooddetails")}>
                <Text style={styles.addItemText}>Add Items</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            }]} />
            
            





      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.coid}
      />



            {/* <OrderSummaryCard
              name="Mixed Vegetable Sal..."
              image={images.salad1}
              price="$12.00"
              onPress={() => console.log("Clicked")}
            />
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            }]} />
            <OrderSummaryCard
              name="Special Pasta Salad"
              image={images.salad2}
              price="$8.00"
              onPress={() => console.log("Clicked")}
            /> */}
            {/* <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            }]} />
            <OrderSummaryCard
              name="Fresh Avocado Juice"
              image={images.salad3}
              price="$4.00"
              onPress={() => console.log("Clicked")}
            /> */}
          </View>
          <View style={[styles.summaryContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          }]}>
            <TouchableOpacity
              onPress={() => navigation.navigate("paymentmethods")}
              style={styles.viewItemTypeContainer}>
              <View style={styles.viewLeftItemTypeContainer}>
                <Image
                  source={icons.wallet2}
                  resizeMode='contain'
                  style={styles.walletIcon}
                />
                <Text style={[styles.viewItemTypeTitle, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                }]}>Payment Methods</Text>
              </View>
              <Image
                source={icons.arrowRight}
                resizeMode='contain'
                style={styles.arrowRightIcon}
              />
            </TouchableOpacity>
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            }]} />
            <TouchableOpacity
              onPress={() => navigation.navigate("addpromo")}
              style={styles.viewItemTypeContainer}>
              <View style={styles.viewLeftItemTypeContainer}>
                <Image
                  source={icons.discount}
                  resizeMode='contain'
                  style={styles.walletIcon}
                />
                <Text style={[styles.viewItemTypeTitle, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                }]}>Get Discounts</Text>
              </View>
              <Image
                source={icons.arrowRight}
                resizeMode='contain'
                style={styles.arrowRightIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.summaryContainer, {
            backgroundColor: COLORS.white, marginBottom: 75,
          }]}>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: dark ? COLORS.grayscale200 : COLORS.grayscale700
              }]}>SubTotal</Text>
              <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>€{subtotal}</Text>
            </View>
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: dark ? COLORS.grayscale200 : COLORS.grayscale700
              }]}>Delivery Fee</Text>
              <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>€{deleveryfee}</Text>
            </View>
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
            }]} />
            <View style={styles.view}>
              <Text style={[styles.viewLeft, {
                color: dark ? COLORS.grayscale200 : COLORS.grayscale700
              }]}>Total</Text>
              <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>€{totalamount}</Text>
            </View>
          </View>
        </ScrollView>
        <Button
          title={`Place Order - €${totalamount}`}
          
         // onPress={() => navigation.navigate("checkoutorderscompleted")}
                    onPress={() => navigation.navigate("paymentmethods",{categoryId:categoryId})}
          style={styles.placeOrderButton}
        />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingTop: 16
  },loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
  summaryContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
    marginTop: 12,
    
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.greyscale900
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  view1: {
    height: 52,
    width: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
  },
  view2: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  locationIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white
  },
  viewView: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  defaultView: {
    width: 64,
    height: 26,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
    marginHorizontal: 12
  },
  defaultTitle: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  addressTitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700,
    marginVertical: 4
  },
  viewAddress: {
    marginHorizontal: 16
  },
  arrowRightIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.greyscale900
  },
  orderSummaryView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  addItemView: {
    width: 78,
    height: 26,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.primary,
    borderWidth: 1.4,
  },
  addItemText: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  viewItemTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  viewLeftItemTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
    marginRight: 16
  },
  viewItemTypeTitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.grayscale700,
    marginRight: 16
  },
  placeOrderButton: {
    backgroundColor: COLORS.secondaryWhite,
    position: "absolute",
    bottom: 16,
    width: SIZES.width - 100,
    left: "12%",
    right: 16,
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  }
})

export default CheckoutOrders