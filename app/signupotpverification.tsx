import { BASE_API_URL } from '@/hooks/api';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

type OTPParams = {
  countryid: string;
  areacode: string;
  phone: string;
  otpval?: string;
};

const SignupOTPVerification = () => {
  const { colors, dark } = useTheme();
  const params = useLocalSearchParams<OTPParams>();

  const { countryid, areacode, phone } = params;

  const [time, setTime] = useState<number>(59);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [otpvalue, setOTPValue] = useState<string>();

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const sendDataHandler = async () => {
    const userOtp = otp.trim();

    if (userOtp.length < 4) {
      Alert.alert('Validation Error', 'Please enter the OTP.');
      return;
    }

    const payload = {
      countryid,
      areacode,
      phone,
      otp: userOtp,
    };

    try {
      const response = await fetch(`${BASE_API_URL}/api/otpvarification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.status) {
          router.replace({
            pathname: '/createnewaccount',
            params: { countryid, areacode, phone },
          });
        } else {
          Alert.alert('Error', 'OTP not matching.');
        }
      } else {
        Alert.alert('Error', 'Server error.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const handleResend = async () => {
    const payload = { countryid, areacode, phone };

    try {
      const response = await fetch(`${BASE_API_URL}/api/resendotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status) {
          setOTPValue(result.otpval);
          setOtp('');
          setTime(59);
          startTimer();
          Alert.alert('Success', 'A new OTP has been sent.');
        } else {
          Alert.alert('Error', 'Failed to resend OTP.');
        }
      } else {
        Alert.alert('Error', 'Server error.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.area, { backgroundColor: colors.background }]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="OTP Verification" />

        <ScrollView>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Code has been sent to (+{areacode}){phone}
          </Text>

          <OtpInput
            numberOfDigits={4}
            value={otp}
            onTextChange={(text) => {
              const numbersOnly = text.replace(/[^0-9]/g, '');
              setOtp(numbersOnly);
            }}
            focusColor={COLORS.primary}
            focusStickBlinkingDuration={500}
            keyboardType="numeric"
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                borderColor: dark ? COLORS.gray : COLORS.secondaryWhite,
                borderWidth: 0.4,
                borderRadius: 10,
                height: 58,
                width: 58,
              },
              pinCodeTextStyle: {
                color: dark ? COLORS.white : COLORS.black,
              },
            }}
          />

          <View style={styles.codeContainer}>
            {time > 0 ? (
              <>
                <Text
                  style={[
                    styles.code,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  Resend code in
                </Text>
                <Text style={styles.time}>{` ${time} `}</Text>
                <Text
                  style={[
                    styles.code,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  s
                </Text>
              </>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text
                  style={[
                    styles.code,
                    {
                      color: COLORS.primary,
                      textDecorationLine: 'underline',
                    },
                  ]}
                >
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <Button
          title="Verify"
          filled
          style={styles.button}
          onPress={sendDataHandler}
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
  title: {
    fontSize: 18,
    fontFamily: 'medium',
    textAlign: 'center',
    marginVertical: 54,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    justifyContent: 'center',
  },
  code: {
    fontSize: 18,
    fontFamily: 'medium',
    textAlign: 'center',
  },
  time: {
    fontFamily: 'medium',
    fontSize: 18,
    color: COLORS.primary,
  },
  button: {
    borderRadius: 32,
  },
});

export default SignupOTPVerification;
