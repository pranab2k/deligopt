//Current Address drgable bubble loactin change

import { BASE_URL } from '@/hooks/api';
import { useUserData } from '@/hooks/useUserData';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';
interface AddressInfo {
  formatted: string;
  postalCode: string;
}
const initialState = {
  inputValues: {
    address: '',
    street: '',
    postalCode: '',
    appartment: '',
    otherLabel: '',
    fullname: '',
    mobile: '',
  },
  inputValidities: {
    address: false,
    street: false,
    postalCode: false,
    appartment: false,
    otherLabel: true, // optional maybe?
    fullname: false,
    mobile: false,
  },
  formIsValid: false,
};
const AddNewCurrentAddress = () => {
  const mapRef = useRef<MapView | null>(null);
const refRBSheet = useRef<RBSheet>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
const [selectedLabel, setSelectedLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
     const { dark, colors } = useTheme();
       const userData = useUserData();
         const [error, setError] = useState();
         const router = useRouter();
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access location was denied');
      return;
    }

   
    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(newRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }

    getAddressFromCoords(latitude, longitude);
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const addr = geocode[0];
        const formatted = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}`;
        const postalCode = addr.postalCode || '';
        setAddressInfo({ formatted, postalCode });
      } else {
        setAddressInfo({ formatted: 'Address not found', postalCode: '' });
      }
    } catch (error) {
      console.log('Reverse geocode failed:', error);
      setAddressInfo({ formatted: 'Failed to get address', postalCode: '' });
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    getAddressFromCoords(newRegion.latitude, newRegion.longitude);
  };

  const handleSubmit = async () => {
     if (!(region && addressInfo)) {
    Alert.alert('Error', 'Location not ready yet.');
    return;
  }

  const fullname = formState.inputValues.fullname?.trim();
  const mobile = formState.inputValues.mobile?.trim();
  const otherLabel = formState.inputValues.otherLabel?.trim();

  // === VALIDATIONS ===

  if (!fullname) {
    Alert.alert('Validation Error', 'Full name is required.');
    return;
  }
  if (fullname.length < 2) {
    Alert.alert('Validation Error', 'Full name must be at least 2 characters.');
    return;
  }

  if (!mobile) {
    Alert.alert('Validation Error', 'Mobile number is required.');
    return;
  }
  if (!/^\d+$/.test(mobile)) {
    Alert.alert('Validation Error', 'Mobile number must contain only digits.');
    return;
  }
  if (mobile.length < 8 || mobile.length > 15) {
    Alert.alert('Validation Error', 'Mobile number must be valid length.');
    return;
  }

  if (selectedLabel === 'Other' && !otherLabel) {
    Alert.alert('Validation Error', 'Please provide a label for "Other".');
    return;
  }

  if (region && addressInfo) {
    const payload = {
      userid : userData?.userId,
      latitude: region.latitude,
      longitude: region.longitude,
      address: addressInfo.formatted,
      postalCode: addressInfo.postalCode,
      label: selectedLabel === 'Other' ? formState.inputValues.otherLabel : selectedLabel,
      fullname: formState.inputValues.fullname,
      mobile: formState.inputValues.mobile,
    };

    console.log('Submitting:', payload);

    try {
      const response = await fetch(`${BASE_URL}/saveaddress.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed:
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      console.log('Server response:', json);

      if (json.success) {
        Alert.alert('Success', 'Address saved successfully!');
        // Optional: navigate back or reset form here
        router.push('/profile');
      } else {
        Alert.alert('Error', json.message || 'Something went wrong.');
      }

    } catch (error) {
      console.error('POST error:', error);
      Alert.alert('Error', 'Failed to submit address.');
    }

  } else {
    Alert.alert('Error', 'Location not ready yet.');
  }
};
  const handleSubmit333 = async () => {
  if (region && addressInfo) {
    const payload = {
      latitude: region.latitude,
      longitude: region.longitude,
      address: addressInfo.formatted,
      postalCode: addressInfo.postalCode,
      label: selectedLabel === 'Other' ? formState.inputValues.otherLabel : selectedLabel,
      fullname: formState.inputValues.fullname,
      mobile: formState.inputValues.mobile,
    };






    
    console.log('Submitting:', payload);
    Alert.alert('Address Submitted', JSON.stringify(payload, null, 2));
    // TODO: Send to backend!
  } else {
    Alert.alert('Error', 'Location not ready yet.');
  }
};

  const handleSubmit11 = () => {
    if (region && addressInfo) {
      Alert.alert(
        'Selected Address',
        `Latitude: ${region.latitude}\nLongitude: ${region.longitude}\nAddress: ${addressInfo.formatted}\nPostal Code: ${addressInfo.postalCode}`
      );

      // TODO: Send this data to your backend or save it in state
      // Example: submitAddress(region.latitude, region.longitude, addressInfo.formatted, addressInfo.postalCode);
    } else {
      Alert.alert('Error', 'Location not ready yet.');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const inputChangedHandler = useCallback(
        (inputId: string, inputValue: string) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({
                inputId,
                validationResult: result,
                inputValue,
            })
        }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error]);
const handleLabelSelection = (label: any) => {
        setSelectedLabel(label)
    };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
       {/* {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
      )}

      */}
      <View style={styles.markerFixed}>
        <Image
          style={{ width: 40, height: 40 }}
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/684/684908.png' }}
        />
      </View>  
<View style={styles.overlay}>
        
      </View>
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.buttonContainer}>
          <Button filled title="Use Current Location" onPress={getCurrentLocation} style={styles.btn} />
          {addressInfo && (
            <>
              <Text style={styles.addressText}>{addressInfo.formatted}</Text>
              <Text style={styles.addressText}>Pincode: {addressInfo.postalCode}</Text>
            </>
          )}
          <View style={{ marginTop: 10 }}>
            {/* <Button title="Submit" onPress={handleSubmit} /> */}
            <Button
          title="Add More Address details" filled
          onPress={() => refRBSheet.current?.open()}
          
          style={styles.btn}
        />
          </View>
        </View>
  <RBSheet
        ref={refRBSheet}
        height={400}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}
      >
        {/* <Button title="Close" onPress={() => refRBSheet.current?.close()} /> */}
       



<View style={{ flexDirection: 'row', marginVertical: 13 }}>
            {['Home', 'Work', 'Other'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[
                  styles.checkboxContainer,
                  selectedLabel === label && styles.selectedCheckbox,
                  {
                    borderColor: dark ? COLORS.primary : COLORS.greyscale900,
                  },
                ]}
                onPress={() => handleLabelSelection(label as 'Home' | 'Work' | 'Other')}
              >
                <Text
                  style={[
                    selectedLabel === label && styles.checkboxText,
                    {
                      color:
                        selectedLabel === label
                          ? COLORS.white
                          : dark
                          ? COLORS.primary
                          : COLORS.greyscale900,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>



                        <View>
                          {selectedLabel === 'Other' && (
          
            <Input
  id="otherLabel"
  placeholder="Enter label"
  onInputChanged={inputChangedHandler}
  value={formState.inputValues.otherLabel} // ✅ CORRECTED
  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
/>
          )}

 <Input
  id="fullname"
  placeholder="Enter Name"
  onInputChanged={inputChangedHandler}
  value={formState.inputValues.fullname} // ✅ CORRECTED
  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
/>

<Input
  id="mobile"
  placeholder="Enter Mobile"
  maxLength={10}
  keyboardType="numeric"
  onInputChanged={inputChangedHandler}
  value={formState.inputValues.mobile} // ✅ CORRECTED
  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
/>
                          </View>            


{addressInfo && (
            <>
              <Text style={styles.addressText}>{addressInfo.formatted}</Text>
              <Text style={styles.addressText}>Pincode: {addressInfo.postalCode}</Text>
            </>
          )}
  <View style={styles.btnContainer}>
 {/* <Button title="Submit" filled  onPress={() => handleSubmit}  style={styles.btn} /> */}
<Button title="Submit" filled onPress={() => handleSubmit()} style={styles.btn} />
  
        </View>
      </RBSheet>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40, // adjust to center the pin image bottom
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 40,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  addressText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  }, btnContainer: { alignItems: 'center' },
    btn: { 
      width: SIZES.width - 32, 
      paddingHorizontal: 16, 
      marginBottom: 16, 
      backgroundColor: COLORS.primary,
      color:COLORS.white
    },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
     sheetText: { fontSize: 18, marginBottom: 20 },
     roundedCheckBoxContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.gray,
        backgroundColor: COLORS.gray,
        marginRight: 12,
    }, checkboxContainer: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginBottom: 12,
    },
    selectedCheckbox: {
        backgroundColor: COLORS.primary,
    },
    checkboxText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: 'regular',
    },
    starContainer: {
        height: 48,
        width: 48,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
});

export default AddNewCurrentAddress;
