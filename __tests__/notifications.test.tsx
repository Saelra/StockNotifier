import { Alert, AppState } from 'react-native';
import alertNotification, { AlertType } from '../components/priceNotificationElement';
import { stockInformation } from '../app/dashboard';
import { act } from '@testing-library/react-native';

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn((title, message, buttons) => buttons[1].onPress()),
  },
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
}));

const flushPromises = () => new Promise(setImmediate);

describe('alertNotification', () => {
  jest.setTimeout(10000); // Increase test timeout to 10 seconds

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
      await flushPromises();
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

    await act(async () => {
      await alertNotification({ stock: mockStock, threshold: 160, alertType: AlertType.High });
      await flushPromises();
    });

    expect(require('expo-notifications').scheduleNotificationAsync).toHaveBeenCalledWith(
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

    await act(async () => {
      await alertNotification({ stock: mockStock, threshold: 160, alertType: AlertType.High });
      await flushPromises();
    });

    expect(require('expo-notifications').scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Price Alert',
          body: expect.stringContaining('Test Company (TST) stock price has gone above the 160 threshold'),
        }),
      })
    );
  });
});
