import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface UserAddressItemProps {
    name: string;
    address: string;
    active: string; // "1" means active
    onPress: () => void;
}

const UserAddressItem: React.FC<UserAddressItemProps> = ({ name, address, active, onPress }) => {
    const { dark } = useTheme();
    const isActive = active === "1";

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    borderBottomColor: dark ? COLORS.greyscale900 : COLORS.grayscale100,
                    backgroundColor: isActive ? COLORS.tansparentPrimary : 'transparent',
                }
            ]}
        >
            <View style={styles.routeLeftContainer}>
                <View style={[
                    styles.locationIcon1,
                    isActive && { backgroundColor: COLORS.primary + '20' } // lighter highlight
                ]}>
                    <View style={styles.locationIcon2}>
                        <Image
                            source={icons.location2 as ImageSourcePropType}
                            resizeMode='contain'
                            style={styles.locationIcon3}
                        />
                    </View>
                </View>
                <View>
                    <Text style={[styles.routeName, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{name}</Text>
                    <Text style={[styles.routeAddress, {
                        color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                    }]}>{address}</Text>
                </View>
            </View>
            {isActive && (
                <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Current</Text>
                </View>
            )}
            <Image
                source={icons.editPencil as ImageSourcePropType}
                resizeMode='contain'
                style={styles.editIcon}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    routeLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    locationIcon1: {
        height: 52,
        width: 52,
        borderRadius: 999,
        marginRight: 12,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: "center",
        justifyContent: "center",
    },
    locationIcon2: {
        height: 36,
        width: 36,
        borderRadius: 999,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    locationIcon3: {
        height: 16,
        width: 16,
        tintColor: COLORS.white
    },
    routeName: {
        fontSize: 18,
        fontFamily: "bold",
        marginBottom: 6
    },
    routeAddress: {
        fontSize: 12,
        fontFamily: "regular"
    },
    editIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.primary
    },
    activeBadge: {
        position: 'absolute',
        top: 10,
        right: 40,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    activeBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontFamily: 'bold',
    }
});

export default UserAddressItem;
