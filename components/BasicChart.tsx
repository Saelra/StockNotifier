import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

type chartProp = {
  stockPrices: number[];
  priceDates?: string[];
  chartWidth?: number;
  chartHeight?: number;
};

function getKeyElements<T>(arr: T[]): T[] {

  const n = arr.length;

  // Arrays with three elements or less can be returned as-is
  if (n <= 3) {
      return arr;
  }
  // Calculate potential middle index
  const middleIndex = Math.floor(n / 2);
  const result: T[] = [];

  // Always include the first element
  result.push(arr[0]);

  // Include the true middle element if it exists
  if (n % 2 === 1) {
      result.push(arr[middleIndex]);
  }
  // Always include the last element
  result.push(arr[n - 1]);

  // Ensure we don't exceed five elements
  return result.slice(0, 5);
}

const ChartObject = ({ stockPrices, priceDates, chartWidth, chartHeight }: chartProp) => {
  return (
    <View testID="chart">
      <LineChart
        data={{
          // Get the key price dates (up to 5 of them to avoid label overlap)
          labels: getKeyElements(priceDates ?? []),
          datasets: [
            {
              data: stockPrices,
            },
          ],
        }}
        width={chartWidth ?? Dimensions.get("window").width * 0.9}
        height={chartHeight ?? Dimensions.get("window").height * 0.3}
        yAxisLabel="$"
        chartConfig={{
          backgroundGradientFrom: "#222",
          backgroundGradientTo: "#222",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: 2,
            strokeWidth: 1,
            stroke: "#fff",
          },
        }}
        style={{
          borderRadius: 8,
        }}
      />
    </View>
  );
};

export default ChartObject;