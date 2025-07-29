import { COLORS, icons, images, SIZES } from '@/constants';
import { BASE_URL } from '@/hooks/api';
import { useUserData } from '@/hooks/useUserData';
import { useTheme } from '@/theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// -------------------- Types --------------------
interface UserData {
  token: string;
  userId: string;
  name: string;
  role: string;
  setcurrentcategory: string;
  profileimage: string;
}

interface Address {
  id: string;
  address_name: string;
  is_active?: string;
}

interface ApiResponse {
  status: boolean;
  address: Address[];
}

interface Category {
  catid: string;
  category_name: string;
  category_image: string;
}

// -------------------- Notifications --------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted for push notifications!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}


// -------------------- Header --------------------
const renderHeader = (userData: UserData) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.viewLeft}>
        <Image
          source={
            userData?.profileimage
              ? { uri: userData.profileimage }
              : { uri: 'https://via.placeholder.com/100' }
          }
          resizeMode="cover"
          style={styles.userIcon}
        />
        <View style={styles.viewNameContainer}>
          <Text style={styles.greeeting}>Good Morning 👋</Text>
          <Text style={[styles.title, { color: COLORS.white }]}>{userData.name}</Text>
        </View>
      </View>
      <View style={styles.viewRight}>
        <TouchableOpacity>
          <Image
            source={
              icons?.notificationBell2
                ? icons.notificationBell2
                : { uri: 'https://via.placeholder.com/24' }
            }
            resizeMode="contain"
            style={[styles.bellIcon, { tintColor: COLORS.white }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// -------------------- Home --------------------
const Home = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors } = useTheme();
  const userData = useUserData();
const [activeAddress, setActiveAddress] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  let isMounted = true;
fetchCategories();
  const loadActiveAddress = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      if (jsonValue != null) {
        const parsed = JSON.parse(jsonValue);
        if (isMounted) {
          setActiveAddress(parsed);
          console.log('Loaded active address:', parsed);
        }
      } else {
        console.log('No active address found in storage');
      }
    } catch (e) {
      console.error('Failed to load active address', e);
    }
  };

  // Load immediately
  loadActiveAddress();

  // Then check every 3 seconds
  const interval = setInterval(() => {
    loadActiveAddress();
  }, 3000);

  // Cleanup when unmounts
  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/landingcategorylist.php`);
      const json = await response.json();
      if (json.success) {
        setCategories(json.categories || []);
      } else {
        console.log('API error:', json.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
 const handlePressAddress = () => {
  navigation.navigate('address');
   // console.log('Button pressed!');
  };
  const handlePress = (catid: string) => {
    if (!userData) return;
    navigation.navigate('fooddetails', { categoryId: catid, userid: userData.userId });
  };

  if (!userData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.primary }]}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        {/* {renderHeader(userData)} */}

        <View><TouchableOpacity onPress={handlePressAddress}>
          <Text>{activeAddress.you_are_here} : {activeAddress.address_name}</Text>
          </TouchableOpacity></View>

        <Image
          source={
            images?.deligologowhite
              ? images.deligologowhite
              : { uri: 'https://via.placeholder.com/120' }
          }
          resizeMode="contain"
          style={styles.logo}
        />

        <Text style={styles.titleText}>Choose What You Need</Text>

        <FlatList
          data={categories}
          keyExtractor={item => item.catid.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.profileContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.profileBox}
              onPress={() => handlePress(item.catid)}
            >
              <Image
                source={{
                  uri: item.category_image || 'https://via.placeholder.com/150',
                }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{item.category_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  profileContainer: {
    flexGrow: 1,
  },
  profileBox: {
    width: '47%',
    marginBottom: 24,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: COLORS.gray,
  },
  profileName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    textTransform: 'capitalize',
  },
  headerContainer: {
    flexDirection: 'row',
    width: SIZES.width - 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 32,
  },
  viewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeeting: {
    fontSize: 12,
    fontFamily: 'regular',
    color: 'gray',
    marginBottom: 4,
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  viewNameContainer: {
    marginLeft: 12,
  },
  viewRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
    marginRight: 8,
  },
});

export default Home;
