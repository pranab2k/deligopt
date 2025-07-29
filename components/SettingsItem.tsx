import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, icons, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface SettingsItemProps {
    icon: string;
    name: string;
    onPress: () => void;
    hasArrowRight?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, name, onPress, hasArrowRight = true }) => {
    const { dark } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}>
            <View style={styles.leftContainer}>
                <Image
                    source={icon as ImageSourcePropType}
                    resizeMode='contain'
                    style={[styles.icon, {
                        tintColor: dark ? COLORS.white : COLORS.greyscale900
                    }]}
                />
                <Text style={[styles.name, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>{name}</Text>
            </View>
            {
                hasArrowRight && (
                    <Image
                        source={icons.arrowRight}
                        resizeMode='contain'
                        style={[styles.arrowRight, {
                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                    />
                )
            }
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900
    },
    name: {
        fontSize: 18,
        fontFamily: "semiBold",
        color: COLORS.greyscale900,
        marginLeft: 12
    },
    arrowRight: {
        width: 24,
        height: 24,
        tintColor: COLORS.greyscale900
    }
})

export default SettingsItem;