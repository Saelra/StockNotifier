import React, { useEffect, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { stockInformation } from '../app/dashboard';

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
    } else {
      Alert.alert(
        'Price Alert',
        message,
        [
          { text: 'Discard', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Keep', onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    }
  });
}

export default alertNotification;
