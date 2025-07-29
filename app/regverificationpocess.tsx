import { useRouter } from 'expo-router';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants';

const Signup = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('login'); // ✅ match the route filename or path
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.primary }]}>
      <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          

          <Text>
           Thank you for registering. Please log in
          </Text>

          <Button title="Go to Login" onPress={handlePress} />
        </ScrollView>
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
    fontSize: 30,
    fontFamily: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 22,
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
});

export default Signup;
