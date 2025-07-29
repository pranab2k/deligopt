import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLORS, icons, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface HeaderProps {
    title: string;
    textColor?: string;
}

const Header: React.FC<HeaderProps> = ({ title, textColor }) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { colors, dark } = useTheme();
    const resolvedTextColor = textColor || colors.text;

    return (
        <View style={[styles.container, {
            backgroundColor: COLORS.white, padding: 8
        }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                    source={icons.backw as ImageSourcePropType}
                    resizeMode='contain'
                    style={[styles.backIcon, {
                        tintColor: COLORS.dark1
                    }]}
                />
            </TouchableOpacity>
            <Text style={[styles.title, { color: resolvedTextColor }]}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        width: SIZES.width - 32,
        flexDirection: "row",
        alignItems: "center",
    } as ViewStyle,
    backIcon: {
        width: 24,
        height: 24,
        marginRight: 16,
    } as ImageStyle,
    title: {
        fontSize: 22,
        fontFamily: "bold",
        color: COLORS.black,
    } as TextStyle,
});

export default Header;