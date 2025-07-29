import { FONTS } from '@/constants/fonts';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//Ignore all log notifications
LogBox.ignoreAllLogs();

export default function RootLayout() {
  const [loaded] = useFonts(FONTS);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
   <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="address" />
      <Stack.Screen name="addnewaddress" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgotpasswordemail" />
      <Stack.Screen name="forgotpasswordphonenumber" />
      <Stack.Screen name="forgotpasswordmethods" />
      <Stack.Screen name="cancelorder" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="settingshelpcenter" />
      <Stack.Screen name="settingsprivacypolicy" />
      <Stack.Screen name="settingspayment" />
      <Stack.Screen name="settingssecurity" />
      <Stack.Screen name="settingslanguage" />
      <Stack.Screen name="createnewaccount" />
      <Stack.Screen name="+not-found" />
      </Stack>      
    </ThemeProvider>  
  );
}
