import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
interface UserData {
token: string;
userId: string;
name: string;
  fmname: string;
  lmname: string;
    email: string;
  mobile: string;
  profileimage: string | null;
  role: string;
  setcurrentcategory: string;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user_data');
        if (jsonValue) {
          setUserData(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Error loading user data:', e);
      }
    };

    fetchUserData();
  }, []);

  return userData;
};
