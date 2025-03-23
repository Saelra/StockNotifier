import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import About from '../app/about';




jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock("expo-font");

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

describe('About Component', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<About />);
    expect(getByText('About Us')).toBeTruthy();
    expect(getByTestId("aboutInfo")).toBeTruthy();
  });

  it('navigates to dashboard page when back button is pressed', () => {
    const { getByTestId} = render (<About />);
    const backArrow = getByTestId("backButton");
    fireEvent.press(backArrow);
    expect (mockRouter.push).toHaveBeenCalledWith('/dashboard');

  });
});
