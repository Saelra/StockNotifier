import React from "react";
import {View, Text, Button, Image, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import {Link} from "expo-router";
import DashBoardHeader from '@/components/DashBoardHeader';
import BasicChart from '@/components/BasicChart';
import Symbol from '@/components/Symbol';
import PriceDisplay from '@/components/PriceDispaly';
import History from '@/components/HistoryExample'
import {useState} from "react"



const chartData = [100, 200, 300, 400, 500];
const  chartLabels = ["1 hour", "2 hour", "3 hour", "4 hour", "5 hour"];




const dashboard = () => {
  const[dataState, setDataState] = useState([100, 200, 300, 400, 500]);
  return (
      <View>
        <DashBoardHeader/>
        <Symbol name={"Apple Inc"} symbol={"APPL"}/>        
        <PriceDisplay price={244.60} priceDelta={3.07} percentIncrease={1.2}/>
        <BasicChart chartData={dataState} chartLabels={chartLabels}/>
        <History />

      </View>
    );
  };
  

  export default dashboard;