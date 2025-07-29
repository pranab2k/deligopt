import { BASE_URL } from '@/hooks/api';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Header from '../components/HeaderTwo';
import Input from '../components/Input';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';

const initialState = {
  inputValues: {
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
  },
  inputValidities: {
    firstname: true,
    lastname: true,
    email: true,
    mobile: true,
  },
  formIsValid: false,
};

interface UserData {
  profileimage: string;
  fmname: string;
  lmname: string;
  email: string;
  mobile: string;
}

const EditProfile = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [image, setImage] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const { dark } = useTheme();
  const { userid } = useLocalSearchParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get_user.php?userid=${userid}`);
        const json = await response.json();
        console.log('Fetched user data:', json);
        setUserData(json.data);
      } catch (err: any) {
        Alert.alert('Error', err.message);
      }
    };
    if (userid) {
      fetchUserData();
    }
  }, [userid]);

  useEffect(() => {
    if (userData) {
      dispatchFormState({
        inputId: 'firstname',
        inputValue: userData.fmname,
        validationResult: { isValid: true },
      });
      dispatchFormState({
        inputId: 'lastname',
        inputValue: userData.lmname,
        validationResult: { isValid: true },
      });
    }
  }, [userData]);

  const handleUpdateProfile = async () => {
    const firstname = formState.inputValues.firstname.trim() || userData?.fmname || '';
    const lastname = formState.inputValues.lastname.trim() || userData?.lmname || '';

    if (!firstname || !lastname) {
      Alert.alert('Validation', 'First name and Last name cannot be empty.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userid', userid);
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);

      if (image) {
        formData.append('profile_image', {
          uri: image.uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }
     console.log(formData);
      const response = await fetch(`${BASE_URL}/update_user.php`, {
        method: 'POST',
        body: formData,
         headers: {
          'Content-Type': 'multipart/form-data',
         },
      });

      const json = await response.json();
      console.log('Update response:', json);
 await AsyncStorage.removeItem('@user_data');
      if (json.success) {
        const updatedUserData = {
          userId: userid,
          fmname: firstname,
          lmname: lastname,
          profileimage: json.data?.profileimage || userData?.profileimage,
          name: json.fullname,               
          email: json.email,
          mobile: json.mobile,
          role: json.role,           
          setcurrentcategory: json.setcurrentcategory,
          you_are_here: json.you_are_here,
          address_name: json.address_name,
        };
console.log(updatedUserData);
        await AsyncStorage.setItem('@user_data', JSON.stringify(updatedUserData));

        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Update failed', json.message || 'Something went wrong.');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

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

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Header title="Personal Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: image?.uri || userData?.profileimage }}
                resizeMode='cover'
                style={styles.avatar}
              />
              <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text>First Name</Text>
            <Input
              id="firstname"
              placeholder="First Name"
              onInputChanged={inputChangedHandler}
              errorText={
                formState.inputValidities.firstname === false ? 'First name is required' : ''
              }
              value={formState.inputValues.firstname}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            />

            <Text>Last Name</Text>
            <Input
              id="lastname"
              placeholder="Last Name"
              onInputChanged={inputChangedHandler}
              errorText={
                formState.inputValidities.lastname === false ? 'Last name is required' : ''
              }
              value={formState.inputValues.lastname}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            />

            <Text>Email ID</Text>
            <Input
              id="email"
              placeholder={userData?.email}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              keyboardType="email-address"
              editable={false}
            />

            <Text>Mobile No</Text>
            <Input
              id="mobile"
              placeholder={userData?.mobile}
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              keyboardType="phone-pad"
              editable={false}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Update"
          filled
          style={styles.continueButton}
          onPress={handleUpdateProfile}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default EditProfile;
