import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to obtain push token for renewal alerts');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function scheduleExpiryNotification(
  title: string,
  daysLeft: number,
  docTitle: string,
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `⚠️ ${title} Expiring Soon`,
      body: `"${docTitle}" expires in ${daysLeft} days. Tap to review policy details.`,
      sound: true,
    },
    trigger: null,
  });
}
