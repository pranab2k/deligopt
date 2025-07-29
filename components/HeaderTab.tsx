//import Productlist from '@/components/ProductList';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, icons, images, SIZES } from '../constants';

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

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
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
        height: SIZES.height - 30,
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
        bottom: 0,
        left: "30vw",
        right: 0,
        width: "40vw",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderTopColor: COLORS.white,
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, // iOS shadow
        shadowOpacity: 0.1,
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