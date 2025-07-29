import { BASE_API_URL } from '@/hooks/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, SIZES, icons, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});





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
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId = "f293a064-6eaa-4000-abfa-0c7cd1fcb1c9";
     // Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
     // console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}


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

const Login = () => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { colors, dark } = useTheme();

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
    if (error) {
      setTimeout(() => {
        Alert.alert('Error', error);
      }, 100);
    }
  }, [error]);

  const handleLogin = async () => {
    const { email, password } = formState.inputValues;
//alert(email);
//alert(password);
//alert(expoPushToken);


 if (email && password) {
   setLoading(true); // Show loader
      try {
        const response = await fetch(`${BASE_API_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: password,
            expoPushToken: expoPushToken,
          }),
        });


        const responsedata = await response.json();


            if (responsedata.status === true && responsedata.user) {
      const user = responsedata.user;

            const userData = {
                token: user.token,
                tokenExpiry: user.token_expires_at,
                prefix: user.prefix,
                name: user.first_name + ' ' + user.last_name,
                email: user.email,
                userId: user.userid,
                mobile:user.mobile,
                role: user.role,
                profileimage: user.profileimage,
                setcurrentcategory: Number(user.setcurrentcategory),
                you_are_here: user.you_are_here,
                address_name: user.address_name,               
            };

      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      navigate('(tabs)');
    }else {
          Alert.alert('Error', responsedata.error || 'Login failed');
        }
      } catch (error) {
        //console.error(error);
        Alert.alert('Error', 'Something went wrong');
      } finally {
      setLoading(false); // Hide loader
    }
    } else {
      Alert.alert('Missing Info', 'Please enter all fields.');
    }



  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.primary }]}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.deligologowhite}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>

          <Text style={[styles.title, { color: COLORS.white }]}>
            Login to Your Account
          </Text>

          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.email}
            placeholder="Email"
           // placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />

          <Input
            id="password"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities.password}
            autoCapitalize="none"
            placeholder="Password"
           // placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry
          />

          {loading ? (
            <ActivityIndicator color={COLORS.white} style={{ marginVertical: 20 }} />
          ) : (
            <Button
              title="Sign in"
              onPress={handleLogin}
              style={styles.button}
            />
          )}

          <TouchableOpacity onPress={() => navigate('forgotpasswordmethods')}>
            <Text style={styles.forgotPasswordBtnText}>Forgot the password?</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomLeft, { color: dark ? COLORS.white : COLORS.black }]}>
            Don’t have an account?
          </Text>
          <TouchableOpacity onPress={() => navigate('signup')}>
            <Text style={styles.bottomRight}>  Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
});

export default Login;
