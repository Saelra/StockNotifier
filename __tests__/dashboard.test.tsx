import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Dashboard from '../app/dashboard';
import { setData, getData } from '../services/stock-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../services/stock-storage', () => ({
  setData: jest.fn(),
  getData: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock("expo-font");

describe('Dashboard Component', () => {
  test('renders correctly', () => {
    const { getByText } = render(<Dashboard />);
    expect(getByText('to About')).toBeTruthy();
  });

  test('calls addMockData when button is pressed', async () => {
    const { getByText } = render(<Dashboard />);
    const button = getByText('Add MOck Data');
    
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(setData).toHaveBeenCalled();
    });
  });

  test('clears data when clear button is pressed', async () => {
    const { getByText } = render(<Dashboard />);
    const button = getByText('clear data');

    fireEvent.press(button);

    await waitFor(() => {
      expect(setData).toHaveBeenCalledWith('userStockInfo', {
        priceI: { price: 0, priceDelta: 0, percentIncrease: 0 },
        symbolI: { name: '----', symbol: '----' },
        graphP: [0],
        min: 0,
        max: 0,
      });
    });
  });
});
