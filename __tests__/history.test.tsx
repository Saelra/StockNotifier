import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import NotificationHistoryPage from '@/app/history'; // Adjust the import path as necessary
import { getHistoryData } from '@/components/priceNotificationElement'; // Adjust the import path as necessary

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('@/components/priceNotificationElement', () => ({
  getHistoryData: jest.fn(),
}));

describe('NotificationHistoryPage', () => {

  it('displays "No notifications yet." when there is no history', async () => {
    (getHistoryData as jest.Mock).mockResolvedValue([]);
    render(<NotificationHistoryPage />);
    await waitFor(() => {
      expect(screen.getByText('No notifications yet.')).toBeTruthy();
    });
  });

  it('renders the back button correctly', () => {
    render(<NotificationHistoryPage />);
    expect(screen.getByTestId('back-button')).toBeTruthy();
  });
});