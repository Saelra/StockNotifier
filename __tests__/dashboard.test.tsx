import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import Dashboard from '../app/dashboard';

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

describe("Dashboard Component", () => {
    const mockRouter = { push: jest.fn() };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const {getByText } = render(<Dashboard />);
        expect(getByText("to About")).toBeTruthy();
    })

})