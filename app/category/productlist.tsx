//import Productlist from '@/components/ProductList';
//import { HeaderTab } from '@/components/HeaderTab';
import Header from '@/components/HeaderTwo';
import { COLORS, icons, images, SIZES } from '@/constants';
import { BASE_URL } from '@/hooks/api';
import { useUserData } from '@/hooks/useUserData';
import { useTheme } from '@/theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageSourcePropType, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';


interface UserData {
    token: string;
    userId: string;
    name: string;
    role: string;
    setcurrentcategory: string;
}
const ProductList = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { dark } = useTheme();
    const refRBSheet = useRef<any>(null);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showQtyControl, setShowQtyControl] = useState(false);
    const [qty, setQty] = useState(1);
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const userData = useUserData();
    const [atToCart, setAtToCart] = useState<number>(0);
    //const userId =  userData?.userId;
    const [cartItems, setCartItems] = useState<{ [pid: string]: number }>({});

    interface Product {
        pid: string;
        product_image: ImageSourcePropType;
        product_name: string;
        product_desc: string;
        rating: string;
        reviews: string;
        oldPrice: string;
        price: string;
        product_category: string;
        product_sold: string;
        product_qty: string;
        product_status: string;
        product_date: string;
        product_time: string;
        product_location: string;
        product_lat: string;
        product_long: string;
        product_delivery: string;
        product_delivery_time: string;
        product_delivery_fee: string;
        product_discount: string;
        product_discount_type: string;
        product_discount_value: string;
        product_discount_start: string;
        product_discount_end: string;
        product_tags: string;
        product_variants: string;
        product_addons: string;
        product_nutrition: string;
        product_allergens: string;
        product_sku: string;
        product_barcode: string;
        product_weight: string;
        product_dimensions: string;
        product_brand: string;
        product_manufacturer: string;
        product_warranty: string;
        product_return_policy: string;
        product_shipping: string;
        product_availability: string;
        product_created_at: string;
        product_updated_at: string;
    }
    interface selectedProduct {
        name: string;
        image: string;
        rating: string;
        reviews: string;
        oldPrice: string;
        newPrice: string;
        description: string;
        product_name: string;
        product_desc: string;
    }

    const fetchData = async () => {
        const catid = await AsyncStorage.getItem('setCatToken');
        console.log('Category ID from AsyncStorage:', catid);
        if (catid) {
            setCategoryId(catid);
        } else {
            console.warn('No category ID found in AsyncStorage');
        }
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/productlist.php?catid=${catid}&userid=${userData?.userId || '0'}`);
            const json = await response.json();

            setAtToCart(parseInt(json.addcart) || 0);
            setData(json.product);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCategoryAndData = async () => {
            try {
                const catid = await AsyncStorage.getItem('setCatToken');
                console.log('Category ID from AsyncStorage:', catid);

                if (catid) {
                    setCategoryId(catid);
                    fetchData(catid); // ✅ pass catid!
                } else {
                    console.warn('No category ID found in AsyncStorage');
                }

            } catch (error) {
                console.error('Error reading category ID:', error);
            }
        };

        fetchCategoryAndData();
    }, []);

    // Add to Cart — qty becomes 1
    const handleAddToCart = async (pid: string) => {
        setCartItems(prev => ({
            ...prev,
            [pid]: 1,
        }));

        await updateCartInDatabase(pid, categoryId, 1, userData?.userId || '0'); // Fire-and-forget
    };

    // Increment
    const incrementQty = async (pid: string) => {
        setCartItems(prev => {
            const newQty = (prev[pid] || 0) + 1;
            updateCartInDatabase(pid, categoryId, newQty, userData?.userId || '0'); // Fire-and-forget
            return {
                ...prev,
                [pid]: newQty,
            };
        });
    };

    // Decrement
    const decrementQty = async (pid: string) => {
        setCartItems(prev => {
            const current = prev[pid] || 0;
            const newItems = { ...prev };

            if (current <= 1) {
                delete newItems[pid];
                updateCartInDatabase(pid, categoryId, 0, userData?.userId || '0');
            } else {
                newItems[pid] = current - 1;
                updateCartInDatabase(pid, categoryId, newItems[pid], userData?.userId || '0');
            }

            return newItems;
        });
    };



    const updateCartInDatabase = async (pid: string, categoryid: number, qty: number, userId: number) => {
        //alert(`Updating cart for product ${pid} with quantity ${qty} for user ${userId}`);

        try {
            const response = await fetch(`${BASE_URL}/productorder.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productid: pid,
                    categoryid: categoryId,
                    quantity: qty,
                    userid: userId, // optional: pass user id if needed
                }),
            });
            const data = await response.json();

            //console.log('Order response:', data);
            //setAtToCart(data.addcart); // Update the cart count
            setAtToCart(parseInt(data.addcart) || 0);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };







    /**
    * render header
    */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.viewLeft}>
                    <Image
                        source={images.user1}
                        resizeMode='contain'
                        style={styles.userIcon}
                    />
                    <View style={styles.viewNameContainer}>
                        <Text style={styles.greeeting}>Good Morning👋</Text>
                        <Text style={[styles.title, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>{userData?.name ?? 'Guest'}</Text>
                    </View>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("notifications")}>
                        <Image
                            source={icons.notificationBell2}
                            resizeMode='contain'
                            style={[styles.bellIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
                        />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
            onPress={() => navigation.navigate("favourite")}>
            <Image
              source={icons.heartOutline}
              resizeMode='contain'
              style={[styles.bookmarkIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
            />
          </TouchableOpacity> */}
                </View>
            </View>
        )
    }









    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading product...</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View>{renderHeader()}</View>
            <View style={styles.contentContainer}>
                <Header title="Product" />

                <ScrollView style={{ marginBottom: 70 }}>

                    <View style={{
                        backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite, paddingHorizontal: 12

                    }}>
                        {/* Available Menu for you */}
                        <Text style={[styles.subtitle, {
                            color: dark ? COLORS.white : COLORS.greyscale900
                        }]}>Menu</Text>

                        <View style={styles.cardcontainer}>
                            <FlatList
                                data={data}
                                keyExtractor={item => item.pid}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'space-between' }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.card}
                                        onPress={() => {
                                            setSelectedProduct({
                                                name: item.product_name,
                                                image: typeof item.product_image === 'string' ? item.product_image : '',
                                                rating: item.rating,
                                                reviews: item.reviews,
                                                oldPrice: item.oldPrice,
                                                newPrice: item.price,
                                                description: item.product_desc || 'No description available.',
                                            });
                                            setModalVisible(true);
                                        }}
                                    >
                                        <View style={styles.cardview}>
                                            {/* Product Image */}
                                            <View style={styles.imageContainer}>
                                                <Image
                                                    source={{ uri: typeof item.product_image === 'string' ? item.product_image : '' }}
                                                    style={styles.image}
                                                />
                                            </View>
                                            {/* Product Name */}
                                            <Text style={styles.title}>{item.product_name}</Text>
                                            {/* Rating */}
                                            <View style={styles.ratingRow}>
                                                <Text style={styles.ratingText}>{item.rating}</Text>
                                                <Text style={styles.ratingCount}>({item.reviews})</Text>
                                            </View>
                                            {/* Price */}
                                            <View style={styles.priceRow}>
                                                {/* <Text style={styles.oldPrice}>€{item.oldPrice}</Text> */}
                                                <Text style={styles.newPrice}>€{item.price}</Text>
                                                <Text style={styles.qtyText}>/Qty</Text>
                                            </View>
                                            {cartItems[item.pid] > 0 ? (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={styles.qtyControl}>
                                                        <TouchableOpacity
                                                            onPress={() => decrementQty(item.pid)}
                                                            style={styles.qtyButton}
                                                        >
                                                            <Text style={styles.qtyButtonText}>-</Text>
                                                        </TouchableOpacity>

                                                        <Text style={styles.qtyValue}>{cartItems[item.pid]}</Text>

                                                        <TouchableOpacity
                                                            onPress={() => incrementQty(item.pid)}
                                                            style={styles.qtyButton}
                                                        >
                                                            <Text style={styles.qtyButtonText}>+</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    style={styles.button}
                                                    onPress={() => handleAddToCart(item.pid)}
                                                >
                                                    <Text style={styles.buttonText}>Add to Cart</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                )}


                            />
                        </View>







                        <Modal
                            visible={modalVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <Image source={{ uri: selectedProduct?.image }} style={styles.modalImage} />
                                    <Text style={styles.modalTitle}>{selectedProduct?.name}</Text>
                                    <Text style={styles.modalDesc}>{selectedProduct?.product_desc}</Text>
                                    <Text style={styles.modalPrice}>
                                        <Text style={{ textDecorationLine: 'line-through' }}>{selectedProduct?.oldPrice}</Text>{' '}
                                        €{selectedProduct?.newPrice}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={styles.modalCloseButton}
                                    >
                                        <Text style={styles.modalCloseText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>

                {atToCart > 0 && (
                    <View style={styles.bookBottomContainer}>
                        <TouchableOpacity
                            //style={styles.bookingBtn}
                            onPress={() => navigation.navigate("checkoutorders")}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={icons.cart}
                                    resizeMode="contain"
                                    style={{
                                        height: 20,
                                        width: 20,
                                        tintColor: COLORS.white,
                                        marginRight: 8,
                                        marginTop: 2
                                    }}
                                />
                                <Text style={styles.modalBtnText}>View Cart</Text>
                            </View>
                            <Text style={styles.modalItemText}>{atToCart}  Item</Text>
                        </TouchableOpacity>

                    </View>
                )}
       

            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginBottom: 70

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
        marginTop: 100,
        height: SIZES.height - 100,
        position: "relative",
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
    }, loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        bottom: 150,
        //left: "30%",
        right: 0,
        marginRight: 5,
        paddingVertical: 6,
        paddingHorizontal: 20,
        //width: "40vw",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        borderTopColor: COLORS.white,
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // iOS shadow
        shadowOpacity: 0.4,
        shadowRadius: 4,

    },

    modalBtnText: {
        fontSize: 16,
        fontFamily: "semiBold",
        color: COLORS.white,
        textAlign: "center",
        marginBottom: 2,
        marginTop: 4,
    },
    modalItemText: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.white,
        textAlign: "center",
        marginBottom: 4
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
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, // iOS shadow
        shadowOpacity: 0.1,
        shadowRadius: 4,
        padding: 12,
    },


    cardview: {
        backgroundColor: '#fff', // Use a light background for the card
        borderColor: COLORS.primary || 'orange',
        //borderWidth: 1,
        borderRadius: 12,
        maxWidth: 200,
        width: '100%',
        //margin: 5,
        elevation: 3, // Android shadow
    },

    imageContainer: {
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        padding: 4,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 'auto', // Adjust height to auto for responsive design
        aspectRatio: 1, // Maintain aspect ratio
        resizeMode: 'cover',
        borderRadius: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
        color: '#333',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        color: '#000',
        fontSize: 12,
    },
    ratingCount: {
        marginLeft: 4,
        fontSize: 12,
        color: '#777',
    },
    soldText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        color: '#888',
        marginRight: 6,
        fontSize: 14,
    },
    newPrice: {
        fontWeight: 'semibold',
        color: '#000',
        fontSize: 15,
    },
    qtyText: {
        fontSize: 12,
        color: '#777',
        marginLeft: 4,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary || 'orange',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },

    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        justifyContent: 'flex-start',
        backgroundColor: "#f9f9f9", // Use a light background for the control
        padding: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#eeeee4", // Use a light border color
    },

    qtyButton: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },

    qtyButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },

    qtyValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        width: 24,
        textAlign: 'center',
    },

    cardcontainer: {
        width: '100%',
        marginBottom: 4,
        // Removed justifyContent: 'space-between'
    },
    /*modal*/
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

    modalImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    modalDesc: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        marginBottom: 10,
    },

    modalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#d00',
    },

    modalCloseButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 6,
    },

    modalCloseText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    bellIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 8
    },

    /* header */
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
    viewLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 32
    }, viewNameContainer: {
        marginLeft: 12
    }, viewRight: {
        flexDirection: "row",
        alignItems: "center"
    },
})

export default ProductList