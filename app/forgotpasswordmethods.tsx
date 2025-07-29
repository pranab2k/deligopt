import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Header from '../components/Header';
import { COLORS, SIZES, icons, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

type Nav = {
    navigate: (value: string) => void
};

const ForgotPasswordMethods = () => {
    const { navigate } = useNavigation<Nav>();
    const [selectedMethod, setSelectedMethod] = useState('sms');
    const { colors, dark } = useTheme();

    const handleMethodPress = (method: any) => {
        setSelectedMethod(method);

    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.primary }]}>
            <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
                <Header title="Forgot Password" textColor={COLORS.white} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.passwordContainer}>
                        <Image
                            source={dark ? illustrations.passwordDark : illustrations.password}
                            resizeMode='contain'
                            style={styles.password}
                        />
                    </View>
                    <Text style={[styles.title, {
                        color: COLORS.white
                    }]}>Select which contact details
                        should we use to reset your password</Text>
                    {/* <TouchableOpacity
                        style={[
                            styles.methodContainer,
                            selectedMethod === 'sms' && { borderColor: COLORS.primary, borderWidth: 2 },
                        ]}
                        onPress={() => handleMethodPress('sms')}>
                        <View style={styles.iconContainer}>
                            <Image
                                source={icons.chat}
                                resizeMode='contain'
                                style={styles.icon} />
                        </View>
                        <View>
                            <Text style={styles.methodTitle}>via SMS:</Text>
                            <Text style={[styles.methodSubtitle, {
                                color: dark ? COLORS.white : COLORS.black
                            }]}>+1 111 ******99</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.methodContainer,
                            selectedMethod === 'email' && { borderColor: COLORS.white, borderWidth: 2 }, // Customize the border color for Email
                        ]}
                        onPress={() => handleMethodPress('email')}
                    >
                        <View style={styles.iconContainer}>
                            <Image
                                source={icons.email}
                                resizeMode='contain'
                                style={styles.icon} />
                        </View>
                        <View>
                            <Text style={styles.methodTitle}>via Email:</Text>
                            <Text style={[styles.methodSubtitle, {
                                color: dark ? COLORS.white : COLORS.black
                            }]}>and***ley@yourdomain.com</Text>
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={[
                            styles.methodContainer,
                            selectedMethod === 'sms' && {
                                borderColor: COLORS.white,
                                borderWidth: 2,
                                backgroundColor: COLORS.primary, // reverse background
                            },
                        ]}
                        onPress={() => handleMethodPress('sms')}>
                        <View style={[
                            styles.iconContainer,
                            selectedMethod === 'sms' && { backgroundColor: COLORS.white }
                        ]}>
                        
                            <Image
                                source={icons.chat}
                                resizeMode='contain'
                                style={[
                                    styles.icon,
                                    selectedMethod === 'sms' && { tintColor: COLORS.primary }
                                ]}
                            />
                        </View>
                        <View>
                            <Text style={[
                                styles.methodTitle,
                                selectedMethod === 'sms' && {
                                color: COLORS.white
                            },

                            ]}>via SMS:</Text>
                            <Text style={[
                                styles.methodSubtitle,
                                { color: dark ? COLORS.white : COLORS.black },
                                selectedMethod === 'sms' && {
                                color: COLORS.white
                            },]}>+1 111 ******99</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.methodContainer,
                            selectedMethod === 'email' && {
                                borderColor: COLORS.white,
                                borderWidth: 2,
                                backgroundColor: COLORS.primary,
                            },
                        ]}
                        onPress={() => handleMethodPress('email')}>
                        <View style={[
                            styles.iconContainer,
                            selectedMethod === 'email' && { backgroundColor: COLORS.white }
                        ]}>
                            <Image
                                source={icons.email}
                                resizeMode='contain'
                                style={[
                                    styles.icon,
                                    selectedMethod === 'email' && { tintColor: COLORS.primary }
                                ]}
                            />
                        </View>
                        <View>
                            <Text style={[
                                styles.methodTitle,
                                selectedMethod === 'email' && {
                                color: COLORS.white
                            },

                            ]}>via Email:</Text>
                            <Text style={[
                                styles.methodSubtitle,
                                { color: dark ? COLORS.white : COLORS.black },
                                selectedMethod === 'email' && {
                                color: COLORS.white
                            },
                            ]}>and***ley@gmail.com</Text>
                        </View>
                    </TouchableOpacity>

                    <Button
                        title="Continue"
                        style={styles.button}
                        onPress={() =>
                            navigate(
                                selectedMethod === "sms"
                                    ? 'forgotpasswordphonenumber'
                                    : 'forgotpasswordemail'
                            )
                        }
                    />
                </ScrollView>
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
        backgroundColor: COLORS.white,
        padding: 16
    },
    password: {
        width: 276,
        height: 250
    },
    passwordContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 32
    },
    title: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        textAlign: 'center'

    },
    methodContainer: {
        width: SIZES.width - 32,
        height: 112,
        borderRadius: 32,
        borderColor: "gray",
        borderWidth: .3,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: COLORS.white
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.greyscale300,
        marginHorizontal: 16
    },
    icon: {
        width: 32,
        height: 32,
        tintColor: COLORS.primary
    },
    methodTitle: {
        fontSize: 16,
        fontFamily: "medium",
        color: COLORS.greyscale600
    },
    methodSubtitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black,
        marginTop: 12
    },
    button: {
        borderRadius: 32,
        marginVertical: 22,
        backgroundColor: COLORS.white
    }
})

export default ForgotPasswordMethods