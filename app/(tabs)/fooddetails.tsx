import { banners, recommendedFoods } from '@/data';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';

import Category from '@/components/Category';
import SubHeaderItem from '@/components/SubHeaderItem';
import VerticalFoodCard from '@/components/VerticalFoodCard';
import { COLORS, icons, SIZES } from '@/constants';
import { BASE_URL } from '@/hooks/api';
import { useUserData } from '@/hooks/useUserData';
import { useTheme } from '@/theme/ThemeProvider';


interface BannerItem {
  id: number;
  discount: string;
  discountName: string;
  bottomTitle: string;
  bottomSubtitle: string;
}

interface CategoryItem {
  catid: string;
  category_name: string;
  category_image: string;
  parent_id: string;
}

interface Category {
  id: string;
  name: string;
}

type Nav = {
  navigate: (value: string) => void;
};

const FoodDetails = () => {
const userData = useUserData();
  
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark, colors } = useTheme();
  

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recommendedProduct, setRecommendedProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  const [atToCart, setAtToCart] = useState<number>(0);
  const [discountFoods, setDiscountFoods] = useState(recommendedFoods);
  //const [categoryId, setCategoryId] = useState<string | null>(null);

const route = useRoute<ScreenBRouteProp>();
 const { categoryId,userid } = route.params || {};



  const fetchCategories = async (categoryId,userid) => {
    //alert(`Fetching categories for catid: ${catid}`);
    try {
      const response = await fetch(`${BASE_URL}/homecategorylist.php?catid=${categoryId}&userid=${userid}`);
      const json = await response.json();

      if (json.success) {
        setCategories(json.categories);
        console.log(json.categories);
      } else {
        console.log('API error:', json.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchRecommendedProduct = async (categoryId,userid) => {
    try {
      const response = await fetch(`${BASE_URL}/homepageproductlist.php?catid=${categoryId}&userid=${userid}`);
      const json = await response.json();
      setLoading(true);
      if (json.success) {
        setRecommendedProduct(json.product);
        setAtToCart(parseInt(json.addcart) || 0);
        setLoading(false);
        //console.log('Recommended addcart:', json.addcart);
        // console.log(json.product); // ✅ correct log
        //  console.log('Recommended products:', json.product);
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
 //console.log('route.params:', route.params);
        // console.log('categoryId:', categoryId);
         //console.log('userData:', userid);
         const isInvalidCategory = !categoryId || categoryId === 0 || categoryId === '';

  if (isInvalidCategory) {
    console.warn('Invalid categoryId, redirecting to homepage...');
    navigation.navigate('/'); // <-- adjust 'Home' to your actual route name
    return;
  }

        if (categoryId && userid) {
           //fetchData(categoryId);
           fetchCategories(categoryId,userid);
            fetchRecommendedProduct(categoryId,userid);
         } else {
           console.warn('Missing categoryId or userId!');
         }

 
  }, [categoryId, userid]);

  // Add to Cart — qty becomes 1
  const handleAddToCart = async (pid: string) => {
    setCartItems(prev => ({
      ...prev,
      [pid]: 1,
    }));

    await updateCartInDatabase(pid, categoryId, 1, userData?.userId); // Fire-and-forget
  };

  // Increment
  const incrementQty = async (pid: string) => {
    setCartItems(prev => {
      const newQty = (prev[pid] || 0) + 1;
      updateCartInDatabase(pid, categoryId, newQty, userData?.userId); // Fire-and-forget
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
        updateCartInDatabase(pid, categoryId, 0, userData?.userId);
      } else {
        newItems[pid] = current - 1;
        updateCartInDatabase(pid, categoryId, newItems[pid], userData?.userId);
      }

      return newItems;
    });
  };



  const updateCartInDatabase = async (pid: string, categoryId: number, qty: number, userId: number) => {
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
      setAtToCart(parseInt(data.addcart) || 0); // Update the cart count

      //return data;
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };







  const keyExtractor = (item: BannerItem) => item.id.toString();

  const handleEndReached = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[styles.dot, index === currentIndex ? styles.activeDot : null]}
    />
  );

  const renderBannerItem = ({ item }: { item: BannerItem }) => (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerTopContainer}>
        <View>
          <Text style={styles.bannerDicount}>{item.discount} OFF</Text>
          <Text style={styles.bannerDiscountName}>{item.discountName}</Text>
        </View>
        <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
      </View>
      <View style={styles.bannerBottomContainer}>
        <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
        <Text style={styles.bannerBottomSubtitle}>{item.bottomSubtitle}</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.viewLeft}>
        <Image
         source={{uri: userData?.profileimage}} 
          resizeMode='cover' 
          style={styles.userIcon}
        />
        <View style={styles.viewNameContainer}>
          {/* <Text style={styles.greeeting}>Good Morning👋</Text> */}
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {userData?.name}
          </Text>
        </View>
      </View>
      <View style={styles.viewRight}>
        <TouchableOpacity onPress={() => navigation.navigate('notifications')}>
          <Image
            source={icons.notificationBell2}
            resizeMode="contain"
            style={[
              styles.bellIcon,
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => {
    const handleInputFocus = () => {
      navigation.navigate('search');
    };

    return (
      <TouchableOpacity
        onPress={handleInputFocus}
        style={[
          styles.searchBarContainer,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite },
        ]}
      >
        <TouchableOpacity>
          <Image
            source={icons.search2}
            resizeMode="contain"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          placeholderTextColor={COLORS.gray}
          style={styles.searchInput}
          onFocus={handleInputFocus}
        />
        <TouchableOpacity>
          <Image
            source={icons.filter}
            resizeMode="contain"
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderBanner = () => (
    <View style={styles.bannerItemContainer}>
      <FlatList
        data={banners}
        renderItem={renderBannerItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / SIZES.width
          );
          setCurrentIndex(newIndex);
        }}
      />
      <View style={styles.dotContainer}>
        {banners.map((_, index) => renderDot(index))}
      </View>
    </View>
  );

  const renderCategories = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading ...</Text>
        </View>
      );
    }

    return (
      <View>
        <SubHeaderItem
          title="Categories"
          navTitle="See all"
          onPress={() => navigation.navigate('categories')}
        />
        <FlatList
          data={categories}
          keyExtractor={(item) => item.catid}
          numColumns={4}
          renderItem={({ item }) => (
            <Category
              name={item.category_name}
              image={item.category_image}
              backgroundColor={dark ? COLORS.dark2 : COLORS.white}
              onPress={() => {
                navigation.navigate('productlist', { categoryId: item.parentid,subcategoryId: item.catid,userid:userid,vendorid:'0' });
              }}
            />
          )}
        />
      </View>
    );
  };

  const renderDiscountedFoods = () => (
    <View>
      <SubHeaderItem
        title="Discount guaranteed!👌"
        navTitle="See all"
        onPress={() => navigation.navigate('discountfoods')}
      />
      <View
        style={{
          backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
          marginVertical: 16,
        }}
      >
        <FlatList
          data={discountFoods}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <VerticalFoodCard
              name={item.name}
              image={item.image}
              distance={item.distance}
              price={item.price}
              fee={item.fee}
              rating={item.rating}
              numReviews={item.numReviews}
              onPress={() => navigation.navigate('fooddetails')}
            />
          )}
        />
      </View>
    </View>
  );

  /**
    * render recommended foods
    */
  const renderRecommendedFoods = () => {
    const [selectedCategories, setSelectedCategories] = useState(["1"]);

    // const filteredFoods = recommendedFoods.filter(food => selectedCategories.includes("1") || selectedCategories.includes(food.categoryId));


    const filteredFoods = recommendedFoods.filter(
      food =>
        selectedCategories.includes(1) ||
        selectedCategories.includes(food.categoryId)
    );

    // Category item
    const renderCategoryItem = ({ item }: { item: categories }) => (
      <TouchableOpacity
        style={{
          backgroundColor: selectedCategories.includes(item.catid) ? COLORS.primary : "transparent",
          padding: 10,
          marginVertical: 5,
          borderColor: COLORS.primary,
          borderWidth: 1.3,
          borderRadius: 24,
          marginRight: 12,
        }}
        onPress={() => toggleCategory(item.catid)}
      >
        <Text style={{
          color: selectedCategories.includes(item.catid) ? COLORS.white : COLORS.primary
        }}>{item.category_name}</Text>
      </TouchableOpacity>
    );

    // Toggle category selection
    const toggleCategory = (categoryId: any) => {
      const updatedCategories = [...selectedCategories];
      const index = updatedCategories.indexOf(categoryId);

      if (index === -1) {
        updatedCategories.push(categoryId);
      } else {
        updatedCategories.splice(index, 1);
      }

      setSelectedCategories(updatedCategories);
    };
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading ...</Text>
        </View>
      );
    }
    return (
      <View>
        <SubHeaderItem
          title="Recommended For You!😍"
          navTitle="See all"
          onPress={() => navigation.navigate("recommendedfoods")}
        />
        <FlatList
          data={categories}
          keyExtractor={item => item.catid}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={renderCategoryItem}
        />
        <View style={{
          backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
          marginVertical: 16
        }}>


          {/*           
          <FlatList
            data={recommendedProduct}
            keyExtractor={item => item.pid}
            renderItem={({ item }) => {
              return (
                <HorizontalFoodCard
                  name={item.product_name}
                  image={item.product_image}
                  distance={item.distance}
                  price={item.price}
                  fee={item.fee}
                  rating={item.rating}
                  numReviews={item.reviews}
                  isPromo={item.isPromo}
                  onPress={() => navigation.navigate("fooddetails")}
                />
              )
            }}
          /> */}

<View>
      {categoryId > 1 ? (
        // If categoryId > 1, show Restaurant
        <View style={styles.cardcontainer}>
            <FlatList
              data={recommendedProduct}
              keyExtractor={item => item.pid}
              numColumns={1} // ONE full-width column
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card} // This should be full width
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

                    <View style={styles.infoContainer} >
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

                      {/* Add to Cart or Quantity Control */}
                      {cartItems[item.pid] > 0 ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                          <View style={styles.qtyControl}>
                            <TouchableOpacity onPress={() => decrementQty(item.pid)} style={styles.qtyButton}>
                              <Text style={styles.qtyButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{cartItems[item.pid]}</Text>
                            <TouchableOpacity onPress={() => incrementQty(item.pid)} style={styles.qtyButton}>
                              <Text style={styles.qtyButtonText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item.pid)}>
                          <Text style={styles.buttonText}>Add to Cart</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
      ) : (
        // Otherwise, show Product
       
        
        <View style={styles.cardcontainer}>
           <Text>Restaurant</Text>
          


            <FlatList
              data={recommendedProduct}
              keyExtractor={item => item.id}
              numColumns={1} // ONE full-width column
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card} // This should be full width
                  onPress={() => navigation.navigate("productlist",{categoryId:categoryId,vendorid:item.id,userid:userid})}
                >
                  <View style={styles.cardview}>
                    {/* Product Image */}
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: typeof item.shop_logo === 'string' ? item.shop_logo : '' }}
                        style={styles.image}
                      />
                    </View>

                    <View style={styles.infoContainer} >
                      {/* Product Name */}
                      <Text style={styles.title}>{item.business_name}</Text>

                      {/* Rating */}
                      <View style={styles.ratingRow}>
                        <Text style={styles.ratingText}>{item.rating}</Text>
                        <Text style={styles.ratingCount}>({item.reviews})</Text>
                      </View>

                    
                     
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
      )}
    </View>

          




        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSearchBar()}
          {renderBanner()}
          {renderCategories()}
          {renderDiscountedFoods()}
          {renderRecommendedFoods()}
        </ScrollView>
      </View>

      {atToCart > 0 && (
        <View style={styles.bookBottomContainer}>
          
          <TouchableOpacity
            //style={styles.bookingBtn}
            onPress={() => navigation.navigate("checkoutorders",{categoryId:categoryId})}
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
            <Text style={styles.modalItemText}>{atToCart} Item</Text>
          </TouchableOpacity>

        </View>
      )}
 
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
                                          <Text style={{ textDecorationLine: 'line-through' }}>€{selectedProduct?.oldPrice}</Text>{' '}
                                          {selectedProduct?.newPrice}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
  modalBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 2,
    marginTop: 4,
  }, modalItemText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 4
  },
  bookBottomContainer: {
    position: "absolute",
    bottom: 100,
    //left: "30%",
    right: 0,
    marginRight: 5,
    paddingVertical:6,
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

  container: { flex: 1, padding: 16, marginBottom: 60 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  viewLeft: { flexDirection: 'row', alignItems: 'center' },
  userIcon: { width: 48, height: 48, borderRadius: 24 },
  viewNameContainer: { marginLeft: 12 },
  greeeting: { fontSize: 12, color: 'gray', marginBottom: 4 },
  title: { fontSize: 14, fontFamily: 'semibold', color: COLORS.black },
  viewRight: { flexDirection: 'row', alignItems: 'center' },
  bellIcon: { width: 24, height: 24 },
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  searchIcon: { width: 24, height: 24 },
  searchInput: { flex: 1, fontSize: 16, marginHorizontal: 8 },
  filterIcon: { width: 24, height: 24 },
  bannerItemContainer: { paddingBottom: 10 },
  bannerContainer: {
    width: SIZES.width - 32,
    height: 154,
    paddingHorizontal: 28,
    paddingTop: 28,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
  },
  bannerTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerDicount: { fontSize: 12, color: COLORS.white },
  bannerDiscountName: { fontSize: 16, color: COLORS.white },
  bannerDiscountNum: { fontSize: 46, color: COLORS.white },
  bannerBottomContainer: { marginTop: 8 },
  bannerBottomTitle: { fontSize: 14, color: COLORS.white },
  bannerBottomSubtitle: { fontSize: 14, color: COLORS.white, marginTop: 4 },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ccc', marginHorizontal: 5 },
  activeDot: { backgroundColor: COLORS.white },
  profileContainer: { flexGrow: 1 },
  profileBox: { flex: 1, alignItems: 'center', margin: 8 },
  profileImage: { width: 100, height: 100, borderRadius: 12 },
  profileName: { marginTop: 8, textAlign: 'center' },

  cardview: {
    backgroundColor: '#fff', // Use a light background for the card
    borderColor: COLORS.primary || 'orange',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //borderWidth: 1,
    borderRadius: 12,
    //maxWidth: 200,
    width: '100%',
    //margin: 5,
    elevation: 3, // Android shadow
  },

  imageContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    //padding: 4,
    //alignItems: 'center',
    width: 90, // Fixed width for the image container
    maxWidth: 200,
    height: 90, // Fixed height for the image container
    overflow: 'hidden', // Ensure the image doesn't overflow the container
    marginRight: 8, 
  },
  infoContainer: {

    padding: 8,
    width: '80%',
    maxWidth: 200, // Limit the width of the info container
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    fontSize: 12,
  },
  newPrice: {
    fontWeight: 'semibold',
    color: '#000',
    fontSize: 14,
  },
  qtyText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  button: {
    marginTop: 6,
    paddingVertical: 6,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary || 'orange',
    alignItems: 'center',
    maxWidth: 120, // Limit the width of the button
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'flex-start',
    backgroundColor: "#f9f9f9", // Use a light background for the control
    padding: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#eeeee4", // Use a light border color
  },

  qtyButton: {
    width: 25,
    height: 25,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    marginHorizontal: 4,
  },

  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
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
  }, card: {
    flex: 1,
    margin: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingLeft: 12,
    paddingVertical: 0,

  },
  image: {
    width: '100%',
    height: 'auto', // Adjust height to auto for responsive design
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: 'cover',
    borderRadius: 12,
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

});

export default FoodDetails;
