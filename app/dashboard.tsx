import React from "react";
import {View, Button} from "react-native";
import {Link} from "expo-router";
import DashBoardHeader from '@/components/DashBoardHeader';
import BasicChart from '@/components/BasicChart';
import Symbol from '@/components/Symbol';
import PriceDisplay from '@/components/PriceDisplay';
import History from '@/components/HistoryExample'
import {useState, useEffect} from "react"
import { setData, getData } from '../services/stock-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

type historyObject = {
  dateOccurrence : Date,
  isPositive: boolean,
  priceDifference : number
}


const createFakeHistory : historyObject[] = [
      {
        dateOccurrence : new Date('2025-01-01'),

        isPositive: true,
        priceDifference : 4.00
    },
    {
      dateOccurrence : new Date('2025-01-28'),

      isPositive: false,
      priceDifference : 2.00
    },
    {
      dateOccurrence : new Date('2025-02-14'),
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

export interface stockInformation {
  priceI : priceInformation;
  symbolI: symbolInformation;
  graphP: number[];
  min: number;
  max: number;
}

const dashboard = () => {

  const [dataState, setDataState] = useState([0]);
  const [priceInfo, setPriceInfo] = useState<priceInformation>({price: 0, priceDelta: 0, percentIncrease: 0})
  const [symbolInfo, setSymbolInfo] = useState<symbolInformation>({name : "-----", symbol: "---" })
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [historyList, setHistoryList] = useState<historyObject[]>([]);
  const [ticker, setTicker] = useState<string >("appl");

  const handleTickerDataSelect = (data: string) => {
    setTicker(data);
    const newSymbolInformation: symbolInformation = {
      name: 'need API return name',
      symbol: data
    }
    changeSymbol(newSymbolInformation);
  };

  const setHistoryData = async (key : string, data: historyObject[]  ) => {
    try {     
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      console.log(`Data has been saved to ${key}.`);
    } catch (error) {
      console.error(`Error saving data to ${key}:`, error);
    }
  }

  const getHistoryData = async (key: string): Promise<historyObject[] > => {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      return jsonData != null ? JSON.parse(jsonData) : [];
    } catch (error) {
      console.error(`Error getting data from ${key}:`, error);
      return [];
    }
  }

  function changeSymbol(sym: symbolInformation):void {
    setHistoryData(sym.symbol,historyList);
    clearData();
    console.log("getting history data");
    setSymbolInfo(sym);
    //pull from history the history :)
    // updateCurrentStockInfo();
    
  }

  useEffect(() => {
    if (symbolInfo.symbol !== "---") { // check if symbolInfo is properly updated
      updateCurrentStockInfo();
    }
  }, [symbolInfo]);

  const [currentStockInfo, setCurrentStockInfo] = useState<stockInformation>(() => {
    const currentStock : stockInformation = {
      priceI : priceInfo,
      symbolI: symbolInfo,
      graphP: dataState,
      min: minValue,
      max: maxValue
     }
     return currentStock;
  })

  useEffect(() => {
    console.log("useEffect active"); //remove me for production!
    getData('userStockInfo').then(value => {
      if(value) {
        console.log("Success! values retrieved from storage");
        setDataState(value.graphP);
        setPriceInfo(value.priceI);
        setSymbolInfo(value.symbolI);
        setMinValue(value.min);
        setMaxValue(value.max);
        // getHistoryData(value.symbolI.symbol)
        // .then(hValue => {setHistoryList(hValue)})
      } else{
        updateCurrentStockInfo();
      }

    }
  )}, []);

  async function updateCurrentStockInfo(): Promise<void> {
    // Retrieve min and max values from AsyncStorage
    const minPrice = await AsyncStorage.getItem(`minPrice-${symbolInfo.symbol}`);
    const maxPrice = await AsyncStorage.getItem(`maxPrice-${symbolInfo.symbol}`);

    // console.log("Retrieved minPrice:", minPrice);
    // console.log("Retrieved maxPrice:", maxPrice);
  
    // Ensure we parse the values as numbers and handle null values
    const parsedMinPrice = minPrice ? parseFloat(minPrice) : 0;
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : 0;

    const currentStock : stockInformation = {
      priceI: priceInfo,
      symbolI: symbolInfo,
      graphP: dataState,
      min: parsedMinPrice,
      max: parsedMaxPrice
    }
    console.log(currentStock);
     setCurrentStockInfo(currentStock);
     setData('userStockInfo', currentStock);
  }

  function addNewHistoryObject(price: number, threshold: number, priceDelta: number): void {
      const newHistoryObject : historyObject  = {
        dateOccurrence: new Date(),
        isPositive: (price > threshold),
        priceDifference: Math.abs(price - priceDelta)
      };
      const newHistoryList: historyObject[] = [...historyList,newHistoryObject]
      
      //only keep the last 10 History objects. 
      if(newHistoryList.length > 4){ 
        newHistoryList.shift();
      }
      setHistoryList(newHistoryList);
  }

  function addPrice(newStockPrice : number) : void {
    let newArray : number[] = [...dataState, newStockPrice];
    if(dataState.indexOf(0) === 0){
      newArray = [newStockPrice];
    }else {
      newArray = [...dataState, newStockPrice];
    }


    if(dataState.length > 30){
      newArray.shift();
    }

    setDataState(newArray);

    const newPriceInfo : priceInformation = {
      price: newStockPrice,
      priceDelta : (priceInfo.price - newStockPrice),
      percentIncrease : (Math.abs(priceInfo.price - newStockPrice) / newStockPrice) * 100
    }

    //check for min and max 
    if(newPriceInfo.price > maxValue){
      addNewHistoryObject(newPriceInfo.price, maxValue, newPriceInfo.priceDelta)
    }else if(newPriceInfo.price < minValue){
      addNewHistoryObject(newPriceInfo.price, minValue, newPriceInfo.priceDelta)
    }
    

    setPriceInfo(newPriceInfo);

    updateCurrentStockInfo();
  }

  function addMockData(){
    const num = (Math.random() * (600 - 400 + 1)) + 400;
    addPrice(num);
  }

  function clearData(){
    const priceI : priceInformation = {
      price: 0,
      priceDelta: 0,
      percentIncrease: 0
    };
    const dataI : number[] = [];
    const symbolI : symbolInformation= {
      name: "----",
      symbol: "----"
    }
    setDataState([0]);
    setHistoryList([]);
    setSymbolInfo(symbolI);
    setPriceInfo(priceI);
    
  }


  return (
      <View>
        <DashBoardHeader onTickerDataSelect={handleTickerDataSelect}/>
        <Symbol name={symbolInfo.name} symbol={symbolInfo.symbol}/>
        <PriceDisplay price={priceInfo.price} priceDelta={priceInfo.priceDelta} percentIncrease={priceInfo.percentIncrease}/>
        <BasicChart chartData={dataState}/>
        <History historyList = {historyList}/>
        <Button title="Add MOck Data" onPress={addMockData} />
        <Button title="clear data" onPress={clearData} />
        <Link href="../about">to About</Link>
      </View>
    );
  };


  export default dashboard;