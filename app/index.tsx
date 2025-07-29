import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { COLORS, images, SIZES } from '../constants';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
type Nav = {
  navigate: (value: string) => void;
};

const Onboarding1 = () => {
  const { navigate } = useNavigation<Nav>();

  useEffect(() => {

 const requestPermissions = async () => {
      const { status: cameraStatus } =  await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
     // const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

      if (
        cameraStatus !== 'granted' ||
        locationStatus !== 'granted' 
       // mediaStatus !== 'granted'
      ) {
        Alert.alert('Permissions required', 'Please grant all permissions to use the app.');
      }
    };

    requestPermissions();

    const checkLoginStatus = async () => {
      try {
        // Optional: Log the global API URL
        //console.log('Using API Base URL:', API.BASE_URL);

        const token = await AsyncStorage.getItem('@user_data');

        if (token) {
          // Token exists — user is logged in
          navigate('(tabs)');
        } else {
          // No token — go to login screen
          navigate('login');
        }
      } catch (error) {
        console.error('Failed to read token:', error);
        navigate('login');
      }
    };

    const timeout = setTimeout(() => {
      checkLoginStatus();
    }, 2000); // Wait 2 seconds (splash screen delay)

    return () => clearTimeout(timeout); // Cleanup timer on unmount
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.primary }]}>
      <View style={styles.logoContainer}>
        <Image
          source={images.deligologowhite}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.primary,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
    width: SIZES.width,
    height: SIZES.height,
  },
  logo: {
    width: 120,
    height: 120,
  },
});

export default Onboarding1;
