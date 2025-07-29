import Header from '@/components/HeaderTwo';
import { BASE_URL } from '@/hooks/api';
import { useUserData } from '@/hooks/useUserData';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES } from '../constants';
import { completedOrders } from '../data';
import { useTheme } from '../theme/ThemeProvider';
interface Myoderlist {
  catid: string;
  categoy_name: string;
  category_image: string;
}
const CompletedOrders = () => {
  const [orders, setOrders] = useState(completedOrders);
  const { dark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const [loading, setLoading] = useState(true);
  const [myoderlist, setMyOrderList] = useState<Myoderlist[]>([]);
  const userData = useUserData();
const [refreshing, setRefreshing] = useState(false);
  const refreshOrders = async () => {
  setRefreshing(true);
  await fetchMyOderList(userId);
  setRefreshing(false);
};
  const fetchMyOderList = async (userid: string) => {

    try {
        const response = await fetch(`${BASE_URL}/myoderdeleverlist.php?userid=${userid}`);
      const json = await response.json();
      console.log('Response:', json);
      if (json.status) {
        setMyOrderList(json.orderlist);
        //console.log('Order List:', json.orderlist);
        //console.log(json.orderlist);
      } else {
        console.log('API error:', json.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  if (userData?.userId) {
    fetchMyOderList(userData.userId);
  } else {
    fetchMyOderList('0');
  }
}, [userData?.userId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading categories...</Text>
      </View>
    );
  }
  return (<ScrollView>
     <View style={[styles.container, {
          backgroundColor: COLORS.primary,
          paddingLeft: 15,
          paddingTop: 10,
          
        }]}>

   <Header title="My Orders" />
      <FlatList
      refreshing={refreshing}
  onRefresh={refreshOrders}
        data={myoderlist}  // ✅ each item = one order
        keyExtractor={item => item.order_id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.cardContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          }]}>
            <View style={styles.detailsContainer}>
              <View style={{ display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>





                {JSON.parse(item.products)?.slice(0, 3).map((product, index) => (

                  <Image
                    key={index}
                    source={{ uri: product.product_image }}
                    resizeMode="cover"
                    style={styles.serviceImage}
                  />
                ))}

 {item.order_count > 3 && (
    <View style={styles.orderBoxContainer}>
      <Text style={styles.orderBoxTitle}>
        +{item.order_count - 3}
      </Text>
    </View>
  )}




              </View>
            </View>
            <View style={styles.buttonContainer}>

              <TouchableOpacity
                onPress={() => navigation.navigate("ereceipt")}
                style={styles.receiptBtn}>
                <Text style={styles.receiptBtnText}>View E-Receipt</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />




    </View></ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fce7f2',
    paddingVertical: 22,
    marginVertical: 0,
  }, loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  statusContainer: {
    width: 54,
    height: 24,
    borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.primary,
    borderWidth: 1
  },
  statusText: {
    fontSize: 10,
    color: COLORS.primary,
    fontFamily: "medium",
  },
  separateLine: {
    width: "100%",
    height: .7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12
  },
  detailsContainer: {
        flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingBottom: 10


  },
  serviceImage: {
    width: 66,
    height: 66,
    borderRadius: 16,
    marginHorizontal: 6
  },
  orderBoxContainer: {
    width: 66,
    height: 66,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 12,
    backgroundColor: COLORS.gray2
  },
  orderBoxTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 66,
  },
  detailsRightContainer: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 17,
    fontFamily: "bold",
    color: COLORS.greyscale900
  },
  address: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    marginVertical: 6
  },
  serviceTitle: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.grayscale700,

  },
  serviceText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: "medium",
    marginTop: 6
  },
  cancelBtn: {
    width: (SIZES.width - 32) / 2 - 16,
    height: 36,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.primary,
  },
  receiptBtn: {
    width: (SIZES.width - 32) / 2 - 16,
    height: 36,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12
  },
  receiptBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  remindMeText: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    marginVertical: 4
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: .8 }, { scaleY: .8 }], // Adjust the size of the switch
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: "100%"
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12
  },
  selectedCancelContainer: {
    marginVertical: 24,
    paddingHorizontal: 36,
    width: "100%"
  },
  cancelTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  cancelSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 8,
    marginTop: 16
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.primary,
    textAlign: "center",
  },
  duration: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
  },
  priceItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,

  },
  reviewContainer: {
    position: "absolute",
    top: 6,
    right: 16,
    width: 46,
    height: 20,
    borderRadius: 16,
    backgroundColor: COLORS.transparentWhite2,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  rating: {
    fontSize: 12,
    fontFamily: "semiBold",
    color: COLORS.primary,
    marginLeft: 4
  },





  orderId: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.greyscale900,
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.primary,
  },
  infoBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  orderBoxContainer: {
    width: 66,
    height: 66,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 12,
    backgroundColor: COLORS.gray2,
    alignItems: "center",
    justifyContent: "center",
  },
  orderBoxTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 66,
  },
})


export default CompletedOrders