import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Landing from '../app/index';
import { registerTaskAsync } from 'expo-background-fetch';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('expo-background-fetch', () => ({

  registerTaskAsync: jest.fn(),
  BackgroundFetchResult: {
    NewData: 'NewData',
    NoData: 'NoData',
    Failed: 'Failed',
  },
}));

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
}));

interface MockRouter {
  push: (path: string) => void;
}

describe('Landing Component', () => {

  let mockRouter: MockRouter;

  // Handle mock router
  beforeEach(() => {

    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    jest.clearAllMocks();
  });

  it('renders correctly', () => {

    const { getByText, getByTestId } = render(<Landing />);

    expect(getByText('Stock Notifier')).toBeTruthy();
    expect(getByText('Easily keep track\nof stock prices')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
    expect(getByText('About Us')).toBeTruthy();
    expect(getByTestId('image-background')).toBeTruthy();
  });

  it('navigates to dashboard page when button is pressed', () => {

    const { getByText } = render(<Landing />);
    const getStartedButton = getByText('Get Started');

    fireEvent.press(getStartedButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to about page when button is pressed', () => {

    const { getByText } = render(<Landing />);
    const aboutUsButton = getByText('About Us');

    fireEvent.press(aboutUsButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/about');
  });

  it('registers background fetch task upon mount', async () => {

    render(<Landing />);

    // Wait until the background fetch task is ready
    await waitFor(() => {

      expect(registerTaskAsync).toHaveBeenCalledWith(
        'background-fetch',
        expect.objectContaining({
          minimumInterval: 60 * 15,
          stopOnTerminate: false,
          startOnBoot: true,
        })
      );
    });
  });
});