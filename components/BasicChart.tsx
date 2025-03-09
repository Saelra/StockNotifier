import React from "react";
import { Text, View } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;


type chartProp = {
  chartData : number[],
  
}

function calculateChartLabels (data: number[]): string[] {
   let chartLabels : string[] = [];
   if(data.length === 0 || data.length === null){
    return [];
   } else {
    for(let i = data.length; i > 0; i--){
        chartLabels[i-1] = i.toString();
    }
   }
   return chartLabels;
  }

const ChartObject = ({ chartData}: chartProp, ) => {
    return (
    <View>
    
    
    <LineChart
        data={{
        labels: calculateChartLabels(chartData),
        datasets: [
            {
            data: chartData
            }
        ]
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
        backgroundColor: "#0cbcd2",
        backgroundGradientFrom: "#12dcd7",
        backgroundGradientTo: "#7812dc",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
        }}
  
        style={{
        marginVertical: 8,
        borderRadius: 16
        }}
        />
       
        </View>
    )
}



export default ChartObject;