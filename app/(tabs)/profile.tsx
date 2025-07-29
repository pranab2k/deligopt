import Button from '@/components/Button';
import SettingsItem from '@/components/SettingsItem';
import { COLORS, icons, images, SIZES } from '@/constants';
import { useUserData } from '@/hooks/useUserData';
import { useTheme } from '@/theme/ThemeProvider';
import { launchImagePicker } from '@/utils/ImagePickerHelper';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Correct import
import { useRouter } from 'expo-router'; // ✅ Better for logout than useNavigation
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
const Profile = () => {
  const refRBSheet = useRef<any>(null);
  const { dark, colors, setScheme } = useTheme();
  const router = useRouter();
  const userData = useUserData();

  // ✅ Logout logic
  const logout = async () => {

    try {
     // await AsyncStorage.clear(); // Clear user session/token
      //router.replace('/login'); // Use absolute path

         // Optional: Close bottom sheet safely
    if (refRBSheet.current) {
      refRBSheet.current.close();
    }
 await AsyncStorage.clear();
    await AsyncStorage.removeItem('@user_data');

    // Wait briefly to ensure RBSheet cleanup
    setTimeout(() => {
      router.replace('/login');
    }, 200); // Adjust delay if needed

    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image source={images.logo} resizeMode='contain' style={styles.logo} />
          <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Profile
          </Text>
        </View>
        <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.headerIcon, { tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const RenderProfile = () => {
    const [image, setImage] = useState(images.user3);
const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const pickImage = async () => {
      try {
        const tempUri = await launchImagePicker();
        if (!tempUri) return;
        setImage({ uri: tempUri });
      } catch (error) {
        console.log("Image pick error", error);
      }
    };

    return (
      <View style={styles.profileContainer}>
        {/* <View>
          <Image source={{uri: userData?.profileimage}} resizeMode='cover' style={styles.avatar} />
                    <TouchableOpacity onPress={pickImage} style={styles.picContainer}>
            <MaterialIcons name="edit" size={12} color={COLORS.white} />
          </TouchableOpacity>
          
        </View>
        <View style={{ marginLeft: 32 }}>
          <Text style={[styles.title, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>{userData?.name}</Text>
          <Text style={[styles.subtitle, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>+1 111 467 378 399</Text>
        </View> */}


      </View>
    );
  };

  const RenderSettings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
      setIsDarkMode((prev) => !prev);
      dark ? setScheme('light') : setScheme('dark');
    };

    return (
      <View style={styles.settingsContainer}>
        <SettingsItem icon={icons.location2Outline} name="Address" onPress={() => router.push('/address')} />
        <SettingsItem icon={icons.userOutline} name="Edit Profile" onPress={() => router.push(`/editprofile?userid=${userData?.userId}`)} />
        {/* <SettingsItem icon={icons.wallet2Outline} name="Payment" onPress={() => router.push('/settingspayment')} /> */}
        <SettingsItem icon={icons.lockedComputerOutline} name="Privacy Policy" onPress={() => router.push('/settingsprivacypolicy')} />
        <SettingsItem icon={icons.infoCircle} name="Help Center" onPress={() => router.push('/settingshelpcenter')} />
        <TouchableOpacity onPress={() => refRBSheet.current.open()} style={styles.logoutContainer}>
          <View style={styles.logoutLeftContainer}>
            <Image source={icons.logout} resizeMode='contain' style={[styles.logoutIcon, { tintColor: 'red' }]} />
            <Text style={[styles.logoutName, { color: 'red' }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {RenderProfile()}
          {RenderSettings()}
        </ScrollView>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        height={SIZES.height * 0.8}
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          draggableIcon: {
            backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200,
            height: 4,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 260,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          },
        }}
      >
        <Text style={styles.bottomTitle}>Logout</Text>
        <View style={[styles.separateLine, {
          backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
        }]} />
        <Text style={[styles.bottomSubtitle, {
          color: dark ? COLORS.white : COLORS.black
        }]}>Are you sure you want to log out?</Text>
        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Yes, Logout"
            filled
            style={styles.logoutButton}
            onPress={() =>logout()}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

   switchcontainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  label: {
    fontSize: 20,
    marginBottom: 10
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 32
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    height: 32,
    width: 32,
    borderRadius: 32
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: .4,
    paddingVertical: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 999
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    right: -6,
    bottom: 12
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginTop: 12
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "medium",
    marginTop: 4
  },
  settingsContainer: {
    marginVertical: 12
  },
  logoutContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  logoutLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  logoutName: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
    marginTop: 12
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 28
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12
  }
});

export default Profile;
