import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

// Define prop types
interface OfferItemProps {
    onPress: () => void;
    title: string;
    description: string;
    primaryColor: string;
    transparentColor: string;
}

const OfferItem: React.FC<OfferItemProps> = ({
    onPress,
    title,
    description,
    primaryColor,
    transparentColor
}) => {
    const { dark } = useTheme();
    const [isClaimed, setIsClaimed] = useState<boolean>(false);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container,
            Platform.OS === 'android' ? styles.androidShadow : styles.iosShadow,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
            <View style={styles.rightContainer}>
                <LinearGradient
                    colors={[primaryColor, transparentColor]}
                    style={styles.iconContainer}>
                    <Image
                        source={icons.ticket}
                        resizeMode='contain'
                        style={styles.ticketIcon}
                    />
                </LinearGradient>
                <View>
                    <Text style={[styles.title, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{title}</Text>
                    <Text style={[styles.description, {
                        color: dark ? COLORS.white : COLORS.grayscale700
                    }]}>{description}</Text>
                </View>
            </View>
            <View style={styles.leftContainer}>
                <TouchableOpacity
                    onPress={() => setIsClaimed(!isClaimed)}
                    style={[styles.claimBtn, {
                        backgroundColor: isClaimed ? "transparent" : COLORS.primary,
                        borderColor: isClaimed ? COLORS.primary : "transparent",
                        borderWidth: isClaimed ? 1 : 0
                    }]}>
                    <Text style={[styles.claimText, {
                        color: isClaimed ? COLORS.primary : COLORS.white
                    }]}>
                        {isClaimed ? "Claimed" : "Claim"}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
        height: 96,
        backgroundColor: COLORS.white,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        height: 56,
        width: 56,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 22
    },
    ticketIcon: {
        height: 26,
        width: 26,
        tintColor: COLORS.white
    },
    title: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginBottom: 8
    },
    description: {
        fontSize: 14,
        color: COLORS.greyScale800,
        fontFamily: 'regular',
    },
    price: {
        fontSize: 20,
        color: COLORS.greyscale900,
        fontFamily: 'bold',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    androidShadow: {
        elevation: 1,
    },
    iosShadow: {
        shadowColor: 'rgba(4, 6, 15, 0.05)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 0,
    },
    claimBtn: {
        paddingHorizontal: 12,
        height: 28,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
    },
    claimText: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.white
    }
});

export default OfferItem;
