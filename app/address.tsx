import UserAddressItem from '@/components/UserAddressItem';
import { BASE_API_URL } from '@/hooks/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Header from '../components/HeaderTwo';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

type Nav = {
  navigate: (value: string) => void;
  replace: (value: string) => void; // Optional: if using replace
};

interface Address {
  id: string;
  you_are_here: string;
  address_name: string;
  is_active: string;
}

const Address = () => {
  const { colors } = useTheme();
  const { navigate, replace } = useNavigation<Nav>();
  const refRBSheet = useRef<RBSheet>(null);

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('@user_data');
        const userData = userDataStr ? JSON.parse(userDataStr) : null;
        setUserId(userData?.userId ?? null);
        setToken(userData?.token ?? null);
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    loadUserData();
  }, []);

  // Fetch addresses when userId & token are ready
  useEffect(() => {
    if (!userId || !token) {
      console.log('No userId or token yet, skipping fetch.');
      setLoading(false);
      return;
    }

    console.log('Fetching addresses for userId:', userId);
    fetchAddresses();
  }, [userId, token]);

  const fetchAddresses = async (): Promise<void> => {
    try {
      const url = `${BASE_API_URL}/api/getaddresses?userid=${userId}`;
      console.log('Fetching from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const text = await response.text();
      console.log('Raw response:', text);

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Server did not return valid JSON. Check API response.');
      }

      console.log('API Response:', data);

      if (data.data && Array.isArray(data.data)) {
        setUserAddresses(data.data);
      } else {
        console.warn('No address data found in response:', data);
        setUserAddresses([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (addressId: string) => {
    try {
      console.log('Updating active address to:', addressId);

      const response = await fetch(`${BASE_API_URL}/update_active_address`, {
        // ✅ Fixed: adjust to match your backend if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          address_id: addressId,
        }),
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (result.status) {
        const updated = userAddresses.map((addr) => ({
          ...addr,
          is_active: addr.id === addressId ? '1' : '0',
        }));
        setUserAddresses(updated);

        const newlyActive = updated.find((addr) => addr.id === addressId);
        if (newlyActive) {
          await AsyncStorage.setItem('activeAddress', JSON.stringify(newlyActive));
          console.log('Saved active address:', newlyActive);

          Alert.alert('Success', 'Active address updated!');
          // Option 1: navigate
          // navigate('home');

          // Option 2: replace to avoid back stack
          replace('home');
        }
      } else {
        Alert.alert('Error', 'Failed to update address.');
      }
    } catch (err) {
      console.error('Set active error:', err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 8 }}>Loading addresses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header textColor="#000" title="Address" />

        <FlatList
          contentContainerStyle={{ marginVertical: 12 }}
          data={userAddresses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserAddressItem
              name={item.you_are_here}
              address={item.address_name}
              active={item.is_active}
              onPress={() => handleSetActive(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No addresses found.
            </Text>
          }
        />
      </View>

      <View style={styles.btnContainer}>
        <Button
          title="Add New Address"
          onPress={() => refRBSheet.current?.open()}
          filled
          style={styles.btn}
        />
      </View>

      <RBSheet
        ref={refRBSheet}
        height={300}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}
      >
        <View style={styles.btnContainer}>
          <Button
            title="Far away from my current location"
            onPress={() => navigate('addnewfarawayaddress')}
            style={styles.btn}
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            title="Near away from my current location"
            onPress={() => navigate('addnewcurrentaddress')}
            style={styles.btn}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: COLORS.white, padding: 16 },
  btnContainer: { alignItems: 'center' },
  btn: { width: SIZES.width - 32, paddingHorizontal: 16, marginBottom: 16 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Address;
