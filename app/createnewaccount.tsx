import { BASE_URL } from '@/hooks/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, SIZES, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

import { Region } from 'react-native-maps';




const initialState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

type Nav = {
  navigate: (value: string) => void;
};

const CreateNewAccount = () => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { colors, dark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
    const [prefix, setPrefix] = useState('Mr.');

     const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
 const params = useLocalSearchParams();
  const { countryid, areacode, phone } = params || {};
  const [image, setImage] = useState<any>(null);
  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    []
  );
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    // registerForPushNotificationsAsync()
    //   .then(token => setExpoPushToken(token ?? ''))
    //   .catch((error: any) => setExpoPushToken(`${error}`));

    // const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    //   //console.log(response);
    // });

    // return () => {
    //   notificationListener.remove();
    //   responseListener.remove();
    // };
  }, []);

useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required.');
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          (loc) => {
            const { latitude, longitude } = loc.coords;
            setRegion({
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
            setMarker({ latitude, longitude });
            inputChangedHandler('latitude', latitude.toString());
            inputChangedHandler('longitude', longitude.toString());
            reverseGeocode(latitude, longitude);
          }
        );

        return () => subscription.remove();
      } catch (err) {
        console.error('Location error:', err);
      }
    })();
  }, [inputChangedHandler]);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const places = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (places.length > 0) {
        const place = places[0];
        const address = `${place.name || ''} ${place.street || ''} ${place.city || ''} ${place.region || ''} ${place.postalCode || ''}`.trim();
        inputChangedHandler('address', address);
        if (place.postalCode) {
          inputChangedHandler('zipcode', place.postalCode);
        }
      }
    } catch (error) {
      console.error('Reverse geocode error:', error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera permission is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    if (error) {
      setTimeout(() => {
        Alert.alert('Error', error);
      }, 100);
    }
  }, [error]);

  const sendDataHandler = async () => {
const {
      firstname,
      lastname,
      email,
      password,
      retypepassword,
      address,
      zipcode,
      latitude,
      longitude,
    } = formState.inputValues;

if (password !== retypepassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert('Error', 'Location not available yet.');
      return;
    }

    if (!firstname || firstname.trim().length < 2) {
      Alert.alert('Error', 'First name must be at least 2 letters.');
      return;
    }

    if (!lastname || lastname.trim().length < 2) {
      Alert.alert('Error', 'Last name must be at least 2 letters.');
      return;
    }

    if (!email || email.trim().length < 2) {
      Alert.alert('Error', 'Please enter an Email Id.');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!address || address.trim().length < 4) {
      Alert.alert('Error', 'Address must be at least 4 characters.');
      return;
    }

    if (!zipcode || zipcode.trim().length < 4) {
      Alert.alert('Error', 'Please enter Zip Code.');
      return;
    }

    const formData = new FormData();
    formData.append('countryid', countryid || '');
    formData.append('areacode', areacode || '');
    formData.append('phone', phone || '');
    formData.append('prefix', prefix);
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('retypepassword', retypepassword);
    formData.append('address', address);
    formData.append('zipcode', zipcode);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    if (image) {
      formData.append('profile_image', {
        uri: image.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/createuseraccount.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result.status) {
        router.replace('/regverificationpocess');
      } else {
        Alert.alert('Error', result.message || 'Failed to create account.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }


  };

const geocodeAddress = async (address: string) => {
  try {
    const results = await Location.geocodeAsync(address);

    if (results.length > 0) {
      const { latitude, longitude } = results[0];

      console.log('Geocoded:', latitude, longitude);

      inputChangedHandler('latitude', latitude.toString());
      inputChangedHandler('longitude', longitude.toString());

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setMarker({ latitude, longitude });
    } else {
      Alert.alert('Not Found', 'Could not geocode the address.');
    }
  } catch (error) {
    console.error('Geocode error:', error);
    Alert.alert('Error', 'Could not geocode address.');
  }
};


  return (
      <SafeAreaView style={[styles.area, { backgroundColor: COLORS.primary }]}>
     <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
  >
   
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}
  keyboardShouldPersistTaps="handled">
        

          <Text style={[styles.title, { color: COLORS.white }]}>
           Create New Account
          </Text>

  
         <View style={{ alignItems: 'center', marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? icons.userDefault2 : image}
                resizeMode="cover"
                style={styles.avatar}
              />
              <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        <Input
            id="firstname"
            placeholder="First Name"
            onInputChanged={inputChangedHandler}
            value={formState.inputValues.firstname}
            returnKeyType="next"
             icon={icons.userOutline}
          />

          <Input
            id="lastname"
            placeholder="Last Name"
            onInputChanged={inputChangedHandler}
            value={formState.inputValues.lastname}
            returnKeyType="next"
             icon={icons.userOutline}
          />

          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.email}
            placeholder="Email"
           // placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />

          {/* <Input
            id="password"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.password}
            autoCapitalize="none"
            placeholder="Password"
           // placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
             secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off' : 'eye'}
             onRightIconPress={() => setShowPassword(!showPassword)}
          /> */}

 <Input
            id="password"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.retypepassword}
            autoCapitalize="none"
            placeholder="Password"
            icon={icons.padlock}
            secureTextEntry
            //secureTextEntry={!showPassword}
           // rightIcon={showPassword ? 'eye-off' : 'eye'}
            //onRightIconPress={() => setShowPassword(!showPassword)}            
          />


          <Input
            id="retypepassword"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.retypepassword}
            autoCapitalize="none"
            placeholder="Retype Password"
            icon={icons.padlock}
            secureTextEntry
           // secureTextEntry={!showRetypePassword}
           // rightIcon={showRetypePassword ? 'eye-off' : 'eye'}
            //onRightIconPress={() => setShowRetypePassword(!showRetypePassword)}            
          />

  {/* <Input
            id="password"
            placeholder="Password"
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off' : 'eye'}
             onRightIconPress={() => setShowPassword(!showPassword)}
            onInputChanged={inputChangedHandler}
            value={formState.inputValues.password}
           // returnKeyType="next"
          />  */}

          {/* <Input
            id="retypepassword"
            placeholder="Retype Password"
          //  secureTextEntry={!showRetypePassword}
           // rightIcon={showRetypePassword ? 'eye-off' : 'eye'}
           // onRightIconPress={() => setShowRetypePassword(!showRetypePassword)}
            onInputChanged={inputChangedHandler}
            value={formState.inputValues.retypepassword}
            returnKeyType="next"
          /> */}


           <Input
            id="address"
            placeholder="Address"
            onInputChanged={inputChangedHandler}
            value={formState.inputValues.address}
            returnKeyType="next"
             icon={icons.home2Outline}
          />

 {/* <Input
  id="address"
  placeholder="Address"
  onInputChanged={(id: string, value: string) => {
    inputChangedHandler(id, value);
  }}
  onBlur={() => geocodeAddress(formState.inputValues.address)}
  value={formState.inputValues.address}
  returnKeyType="next"
  icon={icons.home2Outline}
/>  */}

          <Input
            id="zipcode"
            placeholder="Zip Code"
            keyboardType="numeric"
            onInputChanged={inputChangedHandler}
            value={formState.inputValues.zipcode}
            returnKeyType="done"
             icon={icons.locationOutline}
          />
 {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
          <Button
            title={isLoading ? 'Creating...' : 'Create Account'}
            onPress={sendDataHandler}
            disabled={isLoading}
            style={styles.button}
          />
 )}
         
          
        
</ScrollView>
       </View>


      
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.primary,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 26,
    fontFamily: 'bold',
    textAlign: 'center',
    marginBottom: 22,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: 'semiBold',
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 12,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
    position: 'absolute',
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: 'regular',
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.white,
  },  avatarContainer: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden' },
  avatar: { width: 120, height: 120 },pickImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 8,
  },
});

export default CreateNewAccount;



