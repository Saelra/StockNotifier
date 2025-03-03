import React from "react";
import {View, Text, Button, Image, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import {Link} from "expo-router";
import DashBoardHeader from '@/components/DashBoardHeader';
import BasicChart from '@/components/BasicChart';
import {useState} from "react"



const chartData = [100, 200, 300, 400, 500];
const  chartLabels = ["1 hour", "2 hour", "3 hour", "4 hour", "5 hour"];




const dashboard = () => {
  const[dataState, setDataState] = useState([100, 200, 300, 400, 500]);
  return (
      <View>
        <DashBoardHeader/>
        <Text>Symbol will go here and some more</Text>
        <BasicChart chartData={dataState} chartLabels={chartLabels}/>

      </View>
    );
  };
  

  export default dashboard;