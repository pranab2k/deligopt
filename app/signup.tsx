import { BASE_API_URL } from '@/hooks/api';
import Checkbox from 'expo-checkbox';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Header from '../components/Header';
import { COLORS, SIZES, images } from '../constants';
import { DEFAULT_FLAG, FLAG_IMAGES } from '../constants/flags';
import { useTheme } from '../theme/ThemeProvider';

type Nav = {
  navigate: (value: string, params?: any) => void;
};

type Country = {
  id: string;
  name: string;
  phonecode: string;
  shortname: string;
  flag?: string;
};

const Signup = () => {
  const { navigate } = useNavigation<Nav>();
  const [error, setError] = useState<string | null>(null);
  const [isChecked, setChecked] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedArea, setSelectedArea] = useState<Country | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { dark } = useTheme();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

  const sendDataHandler = async() => {
    if (!isChecked) {
    Alert.alert("Validation Error", "You must accept our Privacy Policy to continue.");
    return;
  }
    if (!phoneNumber.trim()) {
      Alert.alert("Validation Error", "Please enter your phone number.");
      return;
    }
    if (!/^\d+$/.test(phoneNumber)) {
      Alert.alert("Validation Error", "Phone number must contain only numbers.");
      return;
    }
    if (phoneNumber.length < 7 || phoneNumber.length > 10) {
      Alert.alert("Validation Error", "Phone number must be between 7 and 10 digits.");
      return;
    }
    if (!selectedArea) {
      Alert.alert("Validation Error", "Please select a country code.");
      return;
    }

    const fullNumber = `+${selectedArea.phonecode}${phoneNumber}`;
   // console.log("FULL NUMBER:", fullNumber);

//alert(selectedArea.phonecode);
//alert(selectedArea.id);
//alert(phoneNumber);
    
   // navigate("signupotpverification", { countryid: selectedArea.id ,areacode: selectedArea.phonecode ,phone: phoneNumber ,});
   const productData = {
      countryid: selectedArea.id, // You can replace this with dynamic user ID
      areacode: selectedArea.phonecode,
      phone: phoneNumber
    };
   try {
      const response = await fetch(`${BASE_API_URL}/api/userphoneverifiy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order placed:', result);
        if (result.status) {
        navigate("signupotpverification", { countryid: selectedArea.id ,areacode: selectedArea.phonecode ,phone: phoneNumber ,otpval: result.otpval});
          
        }else{
          Alert.alert('Error', result.message);
        }
        // Navigate to the success screen
        //navigate("paymentsuccess");
      } else {
        Alert.alert('Error', 'Something went wrong.');
        console.log('Server error:', response.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  
  };

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/country-list`)
      .then(res => res.json())
      .then(json => {
        if (json.status && Array.isArray(json.data)) {
          const countryData: Country[] = json.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            phonecode: c.phonecode,
            flag: c.shortname.toLowerCase(),
          }));
          setCountries(countryData);
          setFilteredCountries(countryData);

          const defaultCountry = countryData.find(c => c.phonecode === '351');
          setSelectedArea(defaultCountry || countryData[0]);
        }
      })
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [search, countries]);

  function RenderAreasCodesModal() {
    const renderItem = ({ item }: { item: Country }) => (
      <TouchableOpacity
        style={{ padding: 12, flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          setSelectedArea(item);
          setModalVisible(false);
        }}
      >
        {item.flag && (
          <Image
            source={FLAG_IMAGES[item.flag.toLowerCase()] || DEFAULT_FLAG}
            style={{ width: 30, height: 20, marginRight: 10 }}
            resizeMode="contain"
          />
        )}
        <Text style={{ fontSize: 16, color: "#fff" }}>
          {`${item.name} (+${item.phonecode})`}
        </Text>
      </TouchableOpacity>
    );

    return (
      <Modal animationType="slide" transparent visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{
              height: 500,
              width: SIZES.width * 0.85,
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              padding: 16
            }}>
              <TextInput
                placeholder="Search country..."
                placeholderTextColor="#ccc"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 16
                }}
                value={search}
                onChangeText={setSearch}
              />
              <FlatList
                data={filteredCountries}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.primary }]}>
      <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
        <Header title="Login" textColor={COLORS.white} />

        <ScrollView style={{ marginVertical: 54 }} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.deligologowhite}
              resizeMode='contain'
              style={styles.logo}
            />
          </View>

          <Text style={[styles.title, { color: COLORS.white }]}>
            Enter Your Phone Number
          </Text>

          <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500 }]}>
            <TouchableOpacity
              style={styles.selectFlagContainer}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: dark ? COLORS.white : COLORS.black, fontSize: 12 }}>
                +{selectedArea?.phonecode || '--'}
              </Text>

              {selectedArea?.flag && (
                <Image
                  source={FLAG_IMAGES[selectedArea.flag.toLowerCase()] || DEFAULT_FLAG}
                  resizeMode="contain"
                  style={styles.flagIcon}
                />
              )}
            </TouchableOpacity>

            <TextInput
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={[styles.input, { color: COLORS.black }]}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.gray}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                color={isChecked ? COLORS.primary : dark ? COLORS.primary : "gray"}
                onValueChange={setChecked}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.privacy, { color: COLORS.white }]}>
                  By continuing you accept our Privacy Policy
                </Text>
              </View>
            </View>
          </View>

          <Button
            title="Send OTP"
            onPress={sendDataHandler}
            style={styles.button}
          />

         
        </ScrollView>

      </View>

      {RenderAreasCodesModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16
  },
  logo: {
    width: 100,
    height: 100
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
  title: {
    fontSize: 24,
    fontFamily: "bold",
    textAlign: "center"
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: 0.4,
    borderRadius: 6,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 16
  },
  selectFlagContainer: {
    width: 80,
    height: 50,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: 'center'
  },
  flagIcon: {
    width: 30,
    height: 20,
    marginLeft: 8
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
    backgroundColor: COLORS.white
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.white,
    textAlign: "center",
    marginTop: 12
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    position: "absolute",
    bottom: 12,
    right: 0,
    left: 0
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.white
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'center',
    marginVertical: 18,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  privacy: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black,
  },
});

export default Signup;
