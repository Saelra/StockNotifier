import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Detail from '../app/detail';
import { getCurrentSlope, getSlopeAverage, getPriceAverage, getChangeAmount, getChangePercentage } from '@/services/stock-calculator';
import { getData } from '../services/stock-storage';

// Mock Ionicons component
jest.mock('@expo/vector-icons/Ionicons', () => ({
  __esModule: true,
  default: () => <></>,
}));

// Mock state functions
jest.mock('@/services/stock-calculator', () => ({
  getCurrentSlope: jest.fn(),
  getSlopeAverage: jest.fn(),
  getPriceAverage: jest.fn(),
  getChangeAmount: jest.fn(),
  getChangePercentage: jest.fn(),
}));

// Mock async storage functions
jest.mock('../services/stock-storage', () => ({
  getData: jest.fn(),
  setData: jest.fn(),
}));

// Mock fetch function
jest.mock('@/services/stock-fetch', () => ({
  backgroundFetchTask: jest.fn(),
}));

describe('Detail Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates state with fetched data', async () => {

    // Mock async storage data
    (getData as jest.Mock).mockImplementation((key) => {

      switch (key) {

        case 'stockPrices':
          return Promise.resolve([100, 105, 110]);

        case 'priceDates':
          return Promise.resolve([new Date(), new Date(), new Date()]);

        case 'stockTransactions':
          return Promise.resolve([1000, 1500]);

        case 'stockVolumes':
          return Promise.resolve([2000, 2500]);

        case 'stockDetails':
          return Promise.resolve({
            timeRanges: {
              day: {
                lastFetchTime: null,
                currentSlope: null,
                currentPrice: null,
                slopeAvg: null,
                priceAvg: null,
                chg: null,
                chgPercent: null,
                transactions: null,
                volumes: null,
              },
            },
          });

        default:
          return Promise.resolve(null);
      }
    });

    // Mock return values of stock calculator functions
    (getCurrentSlope as jest.Mock).mockReturnValue(5);
    (getSlopeAverage as jest.Mock).mockReturnValue(4.5);
    (getPriceAverage as jest.Mock).mockReturnValue(105);
    (getChangeAmount as jest.Mock).mockReturnValue(5);
    (getChangePercentage as jest.Mock).mockReturnValue(5);

    // Render component
    const { getByText } = render(<Detail />);

    // Wait for states to update (since the storage functions are async)
    await waitFor(() => {

      expect(getByText('$110.00')).toBeTruthy();
      expect(getByText('$105.00')).toBeTruthy();
      expect(getByText('5.00')).toBeTruthy();
      expect(getByText('4.50')).toBeTruthy();
      expect(getByText('$5.00')).toBeTruthy();
      expect(getByText('5.00%')).toBeTruthy();
      expect(getByText('2,500')).toBeTruthy();
      expect(getByText('4,500')).toBeTruthy();
    });
  });
});