import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Button, Platform, View } from 'react-native';

export default function LocalNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission not granted!');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }

  async function showNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Local Notification",
        body: "You triggered this from inside the app.",
        sound: true,
      },
      trigger: null, // Show immediately
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show Notification" onPress={showNotification} />
    </View>
  );
}
