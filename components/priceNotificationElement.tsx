import { Alert, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { stockInformation } from '../app/dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum AlertType {
    High = 'high',
    Low = 'low',
}

type alertObject = {
  stock: stockInformation;
  threshold: number;
  alertType: AlertType;
}

const alertNotification = async ({ stock, threshold, alertType }: alertObject): Promise<boolean> => {

  return new Promise(async (resolve) => {

    const { price } = stock.priceI;
    const { name, symbol } = stock.symbolI;
    const direction = alertType === AlertType.High ? 'above' : 'below';
    const difference = Math.abs(threshold - price).toFixed(2);
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    const message = `${name} (${symbol}) stock price has gone ${direction} the ${threshold} threshold by $${difference} at ${time} on ${date}.`;

    const appState = AppState.currentState;


    if (appState !== 'active') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Price Alert',
          body: message,
        },
        trigger: null,
      });
      resolve(true);  // Automatically resolve true for push notifications
      saveNotificationToHistory(message);

    } else {
      Alert.alert(
        'Price Alert',
        message,
        [
          { text: 'Discard', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Keep', onPress: () => { resolve(true); saveNotificationToHistory(message);}},
        ],
        { cancelable: false }
      );
    }
  });
}

// Function to save the message to history in AsyncStorage
const saveNotificationToHistory = async (message: string) => {
  const historyData = await getHistoryData('notificationHistory');

  const newHistoryObject = {
    dateOccurrence: new Date(),
    message,
  };

  const updatedHistory = [...historyData, newHistoryObject];

  // Save updated history to AsyncStorage
  try {
    const jsonData = JSON.stringify(updatedHistory);
    await AsyncStorage.setItem('notificationHistory', jsonData);
  } catch (error) {
    console.error('Error saving notification history:', error);
  }
};

// Function to retrieve history from AsyncStorage
export const getHistoryData = async (key: string): Promise<any[]> => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    return jsonData != null ? JSON.parse(jsonData) : [];
  } catch (error) {
    console.error(`Error getting data from ${key}:`, error);
    return [];
  }
};

export default alertNotification;
