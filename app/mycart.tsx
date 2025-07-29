import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import CartItem from '../components/CartItem';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { myCart } from '../data';
import { useTheme } from '../theme/ThemeProvider';

const MyCart = () => {
  const { dark, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ paddingBottom: 12 }}>
          <Header title="My Cart" />
        </View>
        <ScrollView
          contentContainerStyle={{
            marginVertical: 22,
            backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite
          }}
          showsVerticalScrollIndicator={false}>
          <FlatList
            data={myCart}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CartItem
                image1={item.image1}
                image2={item.image2}
                image3={item.image3}
                name={item.name}
                numItems={item.numItems}
                distance={item.distance}
                price={item.price}
                onPress={()=>console.log(item)}
              />
            )}
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
  }
})

export default MyCart