import React from "react";
import {View, Text, Button, Image, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import {Link} from "expo-router";
import DashBoardHeader from '@/components/DashBoardHeader';
import BasicChart from '@/components/BasicChart';
import Symbol from '@/components/Symbol';
import PriceDisplay from '@/components/PriceDispaly';
import History from '@/components/HistoryExample'
import {useState, useEffect} from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';



type historyObject = {
  dateOccurance : Date,
  description: string,
  isPositive: boolean,
  priceDifference : number 
}
const createFakeHistory : historyObject[] = [
      {
        dateOccurance : new Date('2025-01-01'),
        description: "stock price above threshold by $5.36",
        isPositive: true,
        priceDifference : 4.00 
    },
    {
      dateOccurance : new Date('2025-01-28'),
      description: "stock price below threshold by -$5.36",
      isPositive: false,
      priceDifference : 2.00 
    }, 
    {
      dateOccurance : new Date('2025-02-14'),
      description: "stock price above threshold by $5.36",
      isPositive: true,
      priceDifference : 4.80 
    }
  ]

type priceInformation = {
  price: number;
  priceDelta : number;
  percentIncrease: number;
}

type symbolInformation = {
  name: string;
  symbol: string;
}

interface stockInformation{
  priceI : priceInformation;
  symbolI: symbolInformation;
  graphP: number[];
}

const saveData = async (key : string, data: stockInformation ) => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonData);
    console.log("data updated");
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

const getData = async (key: string): Promise<stockInformation | null> => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    return jsonData != null ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};

const dashboard = () => {

  const [dataState, setDataState] = useState([0, 200, 300, 400, 500]);
  const [priceInfo, setPriceInfo] = useState<priceInformation>({price: 0, priceDelta: 0, percentIncrease: 0})
  const [symbolInfo, setSymbolInfo] = useState<symbolInformation>({name : "-----", symbol: "---" })
  
  const [currentStockInfo, setCurrentStockInfo] = useState<stockInformation>(() => {
    const currentStock : stockInformation = {
      priceI : priceInfo,
      symbolI: symbolInfo,
      graphP: dataState
     }
     return currentStock;
  })

  useEffect(() => {
    getData('userStockInfo').then(value => {
      if(value) {
        console.log("Success! values retreived from storage");
        setDataState(value.graphP);
        setPriceInfo(value.priceI);
        setSymbolInfo(value.symbolI);
      }
       
      updateCurrentStockInfo();
    }
  )}, []);
 
  function updateCurrentStockInfo(): void{
    const currentStock : stockInformation = {
      priceI : priceInfo,
      symbolI: symbolInfo,
      graphP: dataState
     }

     //@TODO **************check thresholds for min / max; **********************************


     setCurrentStockInfo(currentStock);
     saveData('userStockInfo', currentStockInfo);
  }


  function addPrice(newStockPrice : number) : void {
    const newArray = [...dataState, newStockPrice];
    if(dataState.length > 100){
      newArray.shift();
    }

    setDataState(newArray);

    const newPriceInfo : priceInformation = {
      price: newStockPrice,
      priceDelta : (priceInfo.price - newStockPrice),
      percentIncrease : (Math.abs(priceInfo.price - newStockPrice) / newStockPrice) * 100
    }

    setPriceInfo(newPriceInfo);

    updateCurrentStockInfo();
  }

  function addMOckData(){
    const num = (Math.random() * (600 - 400 + 1)) + 400;
    addPrice(num);
  }

  function clearData(){
    const priceI : priceInformation = {
      price: 0,
      priceDelta: 0,
      percentIncrease: 0
    };
    updateCurrentStockInfo
  }
  

  return (
      <View>
        <DashBoardHeader/>
        <Symbol name={symbolInfo.name} symbol={symbolInfo.symbol}/>        
        <PriceDisplay price={priceInfo.price} priceDelta={priceInfo.priceDelta} percentIncrease={priceInfo.percentIncrease}/>
        <BasicChart chartData={dataState}/>
        <History historyList = {createFakeHistory}/>
        <Button title="Add MOck Data" onPress={addMOckData} />
        <Button title="clear data" onPress={clearData} />
        <Link href={"/about"}>to About</Link>
      </View>
    );
  };
  

  export default dashboard;