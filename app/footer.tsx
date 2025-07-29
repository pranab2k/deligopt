import { useTheme } from "@/theme/ThemeProvider";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { COLORS, icons } from "../constants";



type Nav = {
  navigate: (value: string) => void;
};

const TabLayout = () => {
  const { navigate } = useNavigation<Nav>();
  
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark } = useTheme();

  return (
    // <Tabs
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarHideOnKeyboard: Platform.OS !== 'ios',
    //     tabBarStyle: {
    //       position: 'absolute',
    //       bottom: 0,
    //       right: 0,
    //       left: 0,
    //       elevation: 0,
    //       height: Platform.OS === 'ios' ? 90 :70,
    //       backgroundColor: dark ? COLORS.dark1 : COLORS.white,
    //      paddingBottom:60
    //     },
    //   }}
    // >
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: "",
    //       tabBarIcon: ({ focused }: { focused: boolean }) => {
    //         return (
    //           <View style={{
    //             alignItems: "center",
    //             paddingTop: 16,
    //             width: SIZES.width/4
    //           }}>
    //             <Image
    //               source={focused ? icons.home : icons.home2Outline}
    //               resizeMode="contain"
    //               style={{
    //                 width: 24,
    //                 height: 24,
    //                 tintColor: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //               }}
    //             />
    //             <Text style={{
    //               ...FONTS.body4,
    //               color: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //             }}>Home</Text>
    //           </View>
    //         )
    //       },
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="orders"
    //     options={{
    //       title: "",
    //       tabBarIcon: ({ focused }: { focused: boolean }) => {
    //         return (
    //           <View style={{
    //             alignItems: "center",
    //             paddingTop: 16,
    //             width: SIZES.width/4
    //           }}>
    //             <Image
    //               source={focused ? icons.document : icons.documentOutline}
    //               resizeMode="contain"
    //               style={{
    //                 width: 24,
    //                 height: 24,
    //                 tintColor: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //               }}
    //             />
    //             <Text style={{
    //               ...FONTS.body4,
    //               color: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //             }}>Orders</Text>
    //           </View>
    //         )
    //       },
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="categories"
    //     options={{
    //       title: "",
    //       tabBarIcon: ({ focused }: { focused: boolean }) => {
    //         return (
    //           <View style={{
    //             alignItems: "center",
    //             paddingTop: 16,
    //             width: SIZES.width/4
    //           }}>
    //             <Image
    //               source={focused ? icons.chatBubble2 : icons.chatBubble2Outline}
    //               resizeMode="contain"
    //               style={{
    //                 width: 24,
    //                 height: 24,
    //                 tintColor: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //               }}
    //             />
    //             <Text style={{
    //               ...FONTS.body4,
    //               color: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //             }}>Categories</Text>
    //           </View>
    //         )
    //       },
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="wallet"
    //     options={{
    //       title: "",
    //       tabBarIcon: ({ focused }: { focused: boolean }) => {
    //         return (
    //           <View style={{
    //             alignItems: "center",
    //             paddingTop: 16,
    //             width: SIZES.width/4
    //           }}>
    //             <Image
    //               source={focused ? icons.wallet2 : icons.wallet2Outline}
    //               resizeMode="contain"
    //               style={{
    //                 width: 24,
    //                 height: 24,
    //                 tintColor: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //               }}
    //             />
    //             <Text style={{
    //               ...FONTS.body4,
    //               color: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //             }}>Wallet</Text>
    //           </View>
    //         )
    //       },
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       title: "",
    //       tabBarIcon: ({ focused }: { focused: boolean }) => {
    //         return (
    //           <View style={{
    //             alignItems: "center",
    //             paddingTop: 16,
    //             width: SIZES.width/4
    //           }}>
    //             <Image
    //               source={focused ? icons.user : icons.userOutline}
    //               resizeMode="contain"
    //               style={{
    //                 width: 24,
    //                 height: 24,
    //                 tintColor: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //               }}
    //             />
    //             <Text style={{
    //               ...FONTS.body4,
    //               color: focused ? COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
    //             }}>Profile</Text>
    //           </View>
    //         )
    //       },
    //     }}
    //   />
    // </Tabs>
    <View style={{
position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: dark ? COLORS.dark1 : COLORS.white,      
      paddingBottom: Platform.OS === 'ios' ? 20 : 40,
      zIndex: 99999,    }}>
      <View style={{
      height: 50,
      backgroundColor: dark ? COLORS.dark1 : COLORS.primary,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      
    }}>
      <TouchableOpacity onPress={() => navigation.navigate('fooddetails')}>
        <Image source={icons.home} style={{ width: 24, height: 24, tintColor: COLORS.white, alignSelf: 'center' }} />
        <Text style={{ color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('orders')}>
        <Image source={icons.document} style={{ width: 24, height: 24, tintColor: COLORS.white, alignSelf: 'center' }} />
        <Text style={{ color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('(tabs)')}>
        <Image source={icons.chatBubble2} style={{ width: 24, height: 24, tintColor: COLORS.white, alignSelf: 'center' }} />
        <Text style={{ color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('wallet')}>
        <Image source={icons.wallet2} style={{ width: 24, height: 24, tintColor: COLORS.white, alignSelf: 'center' }} />
        <Text style={{ color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('profile')}>
        <Image source={icons.user} style={{ width: 24, height: 24, tintColor: COLORS.white, alignSelf: 'center' }} />
        <Text style={{ color: COLORS.white, fontSize: 12, textAlign: 'center' }}>Profile</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

export default TabLayout