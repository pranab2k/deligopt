import Header from '@/components/HeaderTwo';
import { COLORS, icons, images, SIZES } from '@/constants';
import { ActiveOrders, CancelledOrders, CompletedOrders } from '@/tabs';
import { useTheme } from '@/theme/ThemeProvider';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar } from 'react-native-tab-view';
const renderScene = SceneMap({
  first: ActiveOrders,
  second: CompletedOrders,
  third: CancelledOrders
});

interface TabRoute {
  key: string;
  title: string;
}

interface RenderLabelProps {
  route: TabRoute;
  focused: boolean;
}

const Orders = () => {
  const layout = useWindowDimensions();
  const { dark, colors } = useTheme();
 const navigation = useNavigation<NavigationProp<any>>();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Active' },
    { key: 'second', title: 'Completed' },
    { key: 'third', title: 'Cancelled' }
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      activeColor={COLORS.primary}
      inactiveColor={dark ? COLORS.white : COLORS.greyscale900}
      style={{
        backgroundColor: dark ? COLORS.dark1 : COLORS.white,
      }}
      renderLabel={({ route, focused }: RenderLabelProps) => (
        <Text style={[{
          color: focused ? COLORS.primary : "gray",
          fontSize: 16,
          fontFamily: "semiBold"
        }]}>
          {route.title}
        </Text>
      )}
    />
  )
  /**
 * Render header
 */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            My Orders
          </Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.moreIcon, {
              tintColor: dark ? COLORS.white : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white}]}>
        {/* {renderHeader()} */}
         <Header title="My Orders" />
<View style={{backgroundColor: COLORS.primary, marginTop: 12, padding: 12}} >
         <TouchableOpacity
                     //style={styles.bookingBtn}
                     onPress={() => navigation.navigate("activeorders")}
                   >
                     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      
                       <Text style={styles.modalBtnText}>Active Order</Text>
                     </View>
                    
                   </TouchableOpacity>
              <TouchableOpacity
                     //style={styles.bookingBtn}
                     onPress={() => navigation.navigate("completedorders")}
                   >
                     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      
                       <Text style={styles.modalBtnText}>My Order List</Text>
                     </View>
                    
                   </TouchableOpacity>
                     {/* <TouchableOpacity
                     //style={styles.bookingBtn}
                     onPress={() => navigation.navigate("activeorders")}
                   >
                     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      
                       <Text style={styles.modalBtnText}>Active Order</Text>
                     </View>
                    
                   </TouchableOpacity> */}
            
            </View>
             {/*    <View style={{backgroundColor: COLORS.primary, marginTop: 12, padding: 12}} >
     <TouchableOpacity
                     //style={styles.bookingBtn}
                     onPress={() => navigation.navigate("activeorders")}
                   >
                     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      
                       <Text style={styles.modalBtnText}>Active Oder</Text>
                     </View>
                    
                   </TouchableOpacity>
             
            
            </View>*/}
        {/* <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        /> */}
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
    padding: 0,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 10,
    justifyContent: "space-between",
    marginBottom: 16
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },modalBtnText: {
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
  backIcon: {
    height: 24,
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.black,
    marginLeft: 16
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
})

export default Orders