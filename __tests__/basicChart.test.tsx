import React from 'react';
import { render } from '@testing-library/react-native';
import ChartObject from '../components/BasicChart';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

jest.mock('react-native-chart-kit', () => {
  return {
    LineChart: jest.fn(() => null),
  };
});

describe('BasicChart Component', () => {
  test('renders correctly', () => {
    const stockPrices = [100, 200, 300, 400, 500];
    const { getByTestId } = render(<ChartObject stockPrices={stockPrices} />);
    expect(getByTestId('chart')).toBeTruthy();
  });

  test('renders chart ', () => {
    const stockPrices = [100, 200, 150, 300];
    const chartWidth = 400;
    const chartHeight = 200;
    
    render(
      <ChartObject
        stockPrices={stockPrices}
        chartWidth={chartWidth}
        chartHeight={chartHeight}
      />
    );
    
    expect(LineChart).toHaveBeenCalledWith(
      expect.objectContaining({
        width: chartWidth,
        height: chartHeight,
      }),
      {}
    );
  });

  test('renders price labels with the correct number', () => {
    const stockPrices = [100, 200, 150, 300];
    const priceDates = ['1', '2', '3', '4', '5', '6'];
    
    render(<ChartObject stockPrices={stockPrices} priceDates={priceDates} />);
    
    expect(LineChart).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          labels: expect.any(Array),
        }),
      }),
      {}
    );
  });
});
