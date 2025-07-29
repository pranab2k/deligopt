import AutoSlider from '@/components/AutoSlider';
//import Productlist from '@/components/ProductList';
import MenuCard from '@/components/MenuCard';
import { useUserData } from '@/hooks/useUserData'; // 👈 new
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from 'react-native-virtualized-view';
import Button from '../components/Button';
import { COLORS, SIZES, icons, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
const FoodDetails = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { dark } = useTheme();
    const refRBSheet = useRef<any>(null);

interface Product {
  pid: string;
  product_image: ImageSourcePropType;
  product_name: string;
  price: string;
}

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
    // Slider images
    const sliderImages = [
        images.pizza1,
        images.pizza2,
        images.pizza3,
        images.pizza4,
        images.pizza5,
    ];

const fetchData = async () => {
    try {
      const response = await fetch('https://atscortex.com/deligo/client/productlist.php');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

// const onSelect = (pid: string) => {
//     console.log('Selected product ID:', pid);
//    // navigation.navigate('fooddetailsadditem', { pid });
//     navigation.navigate('fooddetailsadditem', { pid });
//   };




    // render header
    const RenderHeader = () => {
        const [isFavorite, setIsFavorite] = useState(false);

        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode='contain'
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        onPress={() => setIsFavorite(!isFavorite)}>
                        <Image
                            source={isFavorite ? icons.heart2 : icons.heart2Outline}
                            resizeMode='contain'
                            style={styles.bookmarkIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sendIconContainer}
                        onPress={() => refRBSheet.current.open()}>
                        <Image
                            source={icons.send2}
                            resizeMode='contain'
                            style={styles.sendIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * render content
     */
    const RenderContent = () => {
        const [selectedMenu, setSelectedMenu] = useState(null);
        const [selectedFoodMenu, setSelectedFoodMenu] = useState(null);
        const [selectedDrinkMenu, setSelectedDrinkMenu] = useState(null);
            const [showMessage, setShowMessage] = useState(false);
const userData = useUserData(); // 👈 get user from AsyncStorage
            const handleAddToCart = () => {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
            };
        // Function to handle menu selection
        const handleMenuSelect = (menuId: any) => {
            setSelectedMenu(menuId);
        };

        // Function to handle menu selection
        const handleFoodMenuSelect = (menuId: any) => {
            setSelectedFoodMenu(menuId);
        };

        // Function to handle menu selection
        const handleDrinkMenuSelect = async (menuId: any) => {
          //  setSelectedDrinkMenu(menuId);
             console.log('Selected product ID:', menuId,userData?.userId);

            const productData = {
                productid: menuId,
                userid: userData?.userId,
                };

 try {
      const response = await fetch('https://atscortex.com/deligo/client/productorder.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Add to cart successfully!');
        console.log('Response:', result);
      } else {
        Alert.alert('Error', 'Failed to save product.');
        console.log('Error Response:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while sending data.');
    }


        };

        return (
            <View style={styles.contentContainer}>
               {/*   <TouchableOpacity
                    onPress={() => navigation.navigate("fooddetailsabout")}
                    style={styles.headerTitleContainer}>
                    <Text style={[styles.headerTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Big Garden Salad</Text>
                    <Image
                        source={icons.arrowRight}
                        resizeMode='contain'
                        style={[styles.arrowRightIcon, {
                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                    />
                </TouchableOpacity>
             <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                }]} />
                <TouchableOpacity
                    onPress={() => navigation.navigate("foodreviews")}
                    style={styles.reviewContainer}>
                    <View style={styles.reviewLeftContainer}>
                        <Fontisto name="star" size={20} color="orange" />
                        <Text style={[styles.avgRating, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>4.8</Text>
                        <Text style={[styles.numReview, {
                            color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                        }]}>(1.2k reviews)</Text>
                    </View>
                    <Image
                        source={icons.arrowRight}
                        resizeMode='contain'
                        style={[styles.arrowRightIcon, {
                            tintColor: dark ? COLORS.grayscale100 : COLORS.greyscale900,
                        }]}
                    />
                </TouchableOpacity>
                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                }]} />
                <TouchableOpacity
                    onPress={() => navigation.navigate("fooddetailsoffers")}
                    style={styles.locationContainer}>
                    <View style={styles.locationLeftContainer}>
                        <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
                        <Text style={[styles.locationDistance, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>2.4 Km</Text>
                    </View>
                    <Image
                        source={icons.arrowRight}
                        resizeMode='contain'
                        style={[styles.arrowRightIcon, {
                            tintColor: dark ? COLORS.grayscale100 : COLORS.greyscale900
                        }]}
                    />
                </TouchableOpacity>

               
                <TouchableOpacity
                    onPress={() => navigation.navigate("fooddetailsoffers")}
                    style={styles.deliverContainer}>
                    <Text style={[styles.deliverText,
                    {
                        marginLeft: 26,
                        color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                    }]}>Deliver Now | {" "}</Text>
                    <Image
                        source={icons.moto}
                        resizeMode='contain'
                        style={styles.motoIcon}
                    />
                    <Text style={[styles.deliverText, {
                        color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                    }]}>$ 2.00</Text>
                </TouchableOpacity>
                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                }]} />
                <TouchableOpacity
                    onPress={() => navigation.navigate("fooddetailsoffers")}
                    style={styles.offerContainer}>
                    <View style={styles.offerLeftContainer}>
                        <Image
                            source={icons.discount}
                            resizeMode='contain'
                            style={styles.discountIcon}
                        />
                        <Text style={[styles.discountText, {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        }]}>Offers are available</Text>
                    </View>
                    <Image
                        source={icons.arrowRight}
                        resizeMode='contain'
                        style={[styles.arrowRightIcon, {
                            tintColor: dark ? COLORS.grayscale100 : COLORS.greyscale900
                        }]}
                    />
                </TouchableOpacity>
                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                }]} />

*/}
                {/* Available for your */}
              {/*   <Text style={[styles.subtitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>For You</Text>
                <View style={{
                    backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
                }}>
                    <FlatList
                        data={foodMenu}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <FoodMenuCard
                                id={item.id}
                                image={item.image}
                                name={item.name}
                                price={item.price}
                                isBestSeller={item.isBestSeller}
                                isSelected={selectedMenu === item.id}
                                onSelect={handleMenuSelect}
                            />
                        )}
                    />
                </View>
                */}
                {/* Available Menu for you */}
                <Text style={[styles.subtitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>Menu</Text>
                <View style={{
                    backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
                }}>

                  





                  <FlatList
                        data={data}
                        keyExtractor={item => item.pid}
                        renderItem={({ item }) => (
                            <MenuCard
                                id={item.pid}
                               // image={item.image} '/assets/images/pizzas/pizza1.jpeg'
                                 image ={item.product_image}
                                name={item.product_name}
                                price={item.price}
                                //isPromo={item.price}
                                isSelected={selectedDrinkMenu === item.pid}
                                onSelect={handleDrinkMenuSelect}
                            />
                        )}
                    />
                </View>

                {/* Available Drink for you */}
               {/*  <Text style={[styles.subtitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>Drink</Text>
                <View style={{
                    backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
                }}>
                    <FlatList
                        data={drink}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <DrinkCard
                                id={item.id}
                                image={item.image}
                                name={item.name}
                                price={item.price}
                                isPromo={item.isPromo}
                                isSelected={selectedDrinkMenu === item.id}
                                onSelect={handleDrinkMenuSelect}
                            />
                        )}
                    />
                </View>*/}
            </View>
        )
    }

    return (
        <View style={[styles.area,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
            <StatusBar hidden />
            <AutoSlider images={sliderImages} />
            {RenderHeader()}
            <ScrollView showsVerticalScrollIndicator={false}>
                {RenderContent()}
            </ScrollView>
            <View style={[styles.bookBottomContainer, {
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                borderTopColor: dark ? COLORS.dark1 : COLORS.white,
            }]}>
                <Button
                    title="Order Now"
                    filled
                    style={styles.bookingBtn}
                    //onPress={() => navigation.navigate("fooddetailsadditem")}
                          onPress={() => navigation.navigate("checkoutorders")}
                />
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnPressMask={true}
                height={360}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    draggableIcon: {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale200,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 360,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: "center",
                    }
                }}
            >
                <Text style={[styles.bottomTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>Share</Text>
                {/* <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
                    marginVertical: 12
                }]} />
                <View style={styles.socialContainer}>
                    <SocialIcon
                        icon={socials.whatsapp}
                        name="WhatsApp"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.twitter}
                        name="X"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.facebook}
                        name="Facebook"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.instagram}
                        name="Instagram"
                        onPress={() => refRBSheet.current.close()}
                    />
                </View>
                <View style={styles.socialContainer}>
                    <SocialIcon
                        icon={socials.yahoo}
                        name="Yahoo"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.titktok}
                        name="Tiktok"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.messenger}
                        name="Chat"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.wechat}
                        name="Wechat"
                        onPress={() => refRBSheet.current.close()}
                    />
                </View> */}
            </RBSheet>
        </View>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    headerContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 32,
        zIndex: 999,
        left: 16,
        right: 16
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white
    },
    sendIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white
    },
    sendIconContainer: {
        marginLeft: 8
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    contentContainer: {
        marginHorizontal: 12
    },
    headerTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    headerTitle: {
        fontSize: 26,
        fontFamily: "bold",
        color: COLORS.greyscale900
    },
    arrowRightIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
        marginVertical: 12
    },
    separateLine: {
        width: "100%",
        height: 1,
        backgroundColor: COLORS.grayscale200
    },
    reviewContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 2
    },
    reviewLeftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    avgRating: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginHorizontal: 8
    },
    numReview: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.grayscale700
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between"
    },
    locationLeftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationDistance: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginHorizontal: 8
    },
    deliverContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },
    deliverText: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.grayscale700,
        marginHorizontal: 8
    },
    motoIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.primary
    },
    offerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginVertical: 2
    },
    offerLeftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    discountIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.primary
    },
    discountText: {
        fontSize: 18,
        fontFamily: "semiBold",
        color: COLORS.greyscale900,
        marginHorizontal: 16
    },
    subtitle: {
        fontSize: 22,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 12
    },
    bookBottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: SIZES.width,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 104,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
        borderTopColor: COLORS.white,
        borderTopWidth: 1,
    },
    bookingBtn: {
        width: SIZES.width - 32
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: "semiBold",
        color: COLORS.black,
        textAlign: "center",
        marginTop: 12
    },
    socialContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
        width: SIZES.width - 32
    },
})

export default FoodDetails