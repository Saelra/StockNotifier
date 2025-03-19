import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

type chartProp = {
  chartData: number[];
  chartWidth?: number;
  chartHeight?: number;
};

function calculateChartLabels(data: number[]): string[] {
  let chartLabels: string[] = [];
  if (data.length === 0 || data.length === null) {
    return [];
  } else {
    for (let i = data.length; i < 0; i--) {
      chartLabels[i - 1] = i.toString();
    }
  }
  return chartLabels;
}

const ChartObject = ({ chartData, chartWidth, chartHeight }: chartProp) => {
  return (
    <View>
      <LineChart
        data={{
          labels: calculateChartLabels(chartData),
          datasets: [
            {
              data: chartData,
            },
          ],
        }}
        width={chartWidth ?? Dimensions.get("window").width * 0.9}
        height={chartHeight ?? Dimensions.get("window").height * 0.3}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#222",
          backgroundGradientFrom: "#222",
          backgroundGradientTo: "#222",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 8,
          },
          propsForDots: {
            r: "1",
            strokeWidth: "2",
            stroke: "#fff",
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 8,
        }}
      />
    </View>
  );
};

export default ChartObject;