import OfferItem from '@/components/OfferItem';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const FoodDetailsOffers = () => {
    const { colors, dark } = useTheme();

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Offers Are Available" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
                            marginTop: 16
                        }}>
                        <OfferItem
                            title="Promo New User"
                            description="Valid for new users!"
                            primaryColor="rgba(124, 33, 255,1)"
                            transparentColor="rgba(124, 33, 255,.6)"
                            onPress={() => console.log("Clicked Special")}
                        />
                        <OfferItem
                            title="Free Delivery"
                            description="Free delivery max $4"
                            primaryColor="rgba(251, 209, 42,1)"
                            transparentColor="rgba(251, 209, 42,.6)"
                            onPress={() => console.log("Clicked Special")}
                        />
                        <OfferItem
                            title="Extra 20% Off"
                            description="Special promo only today"
                            primaryColor="rgba(255, 87, 111,1)"
                            transparentColor="rgba(255, 87, 111,.6)"
                            onPress={() => console.log("Clicked Special")}
                        />
                        <OfferItem
                            title="Discount 40% Off"
                            description="Special promo only valid today!"
                            primaryColor="rgba(38, 194, 162,1)"
                            transparentColor="rgba(38, 194, 162,.6)"
                            onPress={() => console.log("Clicked Special")}
                        />
                        <OfferItem
                            title="Special Friday"
                            description="Only for friday!"
                            primaryColor="rgba(254, 189, 33,1)"
                            transparentColor="rgba(254, 189, 33,.6)"
                            onPress={() => console.log("Clicked Special")}
                        />
                        <OfferItem
                            title="Promo New Menu"
                            description="Valid for new menu!"
                            primaryColor="rgba(254, 89, 33,1)"
                            transparentColor="rgba(254, 89, 33,.6)"
                            onPress={() => console.log("Clicked Special")}
                        />
                    </View>
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
    }
})

export default FoodDetailsOffers