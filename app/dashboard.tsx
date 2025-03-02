import React from "react";
import {View, Text, Button, Image, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import {Link} from "expo-router";
import DashBoardHeader from '@/components/DashBoardHeader';
import BasicChart from '@/components/BasicChart';


const dashboard = () => {
    return (
      <View>
        <DashBoardHeader/>
        <Text>Symbol will go here</Text>
        <BasicChart/>

      </View>
    );
  };
  

  export default dashboard;