import React from 'react';
import { Alert } from 'react-native';
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

const alertNotification = ({ stock, threshold, alertType }: alertObject): Promise<boolean> => {
  return new Promise((resolve) => {
    const { price } = stock.priceI;
    const { name, symbol } = stock.symbolI;
    const direction = alertType === AlertType.High ? 'above' : 'below';
    const difference = Math.abs(threshold - price).toFixed(2);
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    const message = `${name} (${symbol}) stock price has gone ${direction} the ${threshold} threshold by $${difference} at ${time} on ${date}.`;

    Alert.alert(
      'Price Alert',
      message,
      [
        { text: 'Discard', onPress: () => resolve(false), style: 'cancel' },
        { text: 'Keep', onPress: () => resolve(true) },
      ],
      { cancelable: false }
    );
  });
}


export default alertNotification;
