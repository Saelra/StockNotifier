import React from 'react';
import { Alert, AppState } from 'react-native';
import alertNotification, { AlertType } from '../components/priceNotificationElement';
import { stockInformation } from '../app/dashboard';
import { render, fireEvent, act } from '@testing-library/react-native';

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

describe('alertNotification', () => {
  const mockStock: stockInformation = {
    priceI: { price: 150, priceDelta: 5, percentIncrease: 3.45 },
    symbolI: { name: 'Test Company', symbol: 'TST' },
    graphP: [140, 145, 150],
    min: 100,
    max: 200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows an alert when app is active', async () => {
    AppState.currentState = 'active';

    await act(async () => {
      await alertNotification({ stock: mockStock, threshold: 160, alertType: AlertType.High });
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Price Alert',
      expect.stringContaining('Test Company (TST) stock price has gone above the 160 threshold'),
      expect.any(Array),
      { cancelable: false }
    );
  });

  it('sends a push notification when app is in background', async () => {
    AppState.currentState = 'background';

    const Notifications = require('expo-notifications');
    Notifications.scheduleNotificationAsync = jest.fn();

    await act(async () => {
      await alertNotification({ stock: mockStock, threshold: 160, alertType: AlertType.High });
    });

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Price Alert',
          body: expect.stringContaining('Test Company (TST) stock price has gone above the 160 threshold'),
        }),
      })
    );
  });

  it('sends a push notification when app is inactive', async () => {
    AppState.currentState = 'inactive';

    const Notifications = require('expo-notifications');
    Notifications.scheduleNotificationAsync = jest.fn();

    await act(async () => {
      await alertNotification({ stock: mockStock, threshold: 160, alertType: AlertType.High });
    });

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Price Alert',
          body: expect.stringContaining('Test Company (TST) stock price has gone above the 160 threshold'),
        }),
      })
    );
  });
});
