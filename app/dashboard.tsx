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

  const [dataState, setDataState] = useState([0, 200, 300, 400, 500]);
  const [priceInfo, setPriceInfo] = useState<priceInformation>({price: 0, priceDelta: 0, percentIncrease: 0})
  const [symbolInfo, setSymbolInfo] = useState<symbolInformation>({name : "-----", symbol: "---" })
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

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
    getData('userStockInfo').then(value => {
      if(value) {
        console.log("Success! values retrieved from storage");
        setDataState(value.graphP);
        setPriceInfo(value.priceI);
        setSymbolInfo(value.symbolI);
        setMinValue(value.min);
        setMaxValue(value.max);
      }

      updateCurrentStockInfo();
    }
  )}, []);

  function updateCurrentStockInfo(): void{
    const currentStock : stockInformation = {
      priceI: priceInfo,
      symbolI: symbolInfo,
      graphP: dataState,
      min: 0,
      max: 0
    }

     //@TODO **************check thresholds for min / max; **********************************


     setCurrentStockInfo(currentStock);
     setData('userStockInfo', currentStockInfo);
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
    updateCurrentStockInfo
  }


  return (
      <View>
        <DashBoardHeader min={minValue} setMin={setMinValue} max={maxValue} setMax={setMaxValue}/>
        <Symbol name={symbolInfo.name} symbol={symbolInfo.symbol}/>
        <PriceDisplay price={priceInfo.price} priceDelta={priceInfo.priceDelta} percentIncrease={priceInfo.percentIncrease}/>
        <BasicChart chartData={dataState}/>
        <History historyList = {createFakeHistory}/>
        <Button title="Add MOck Data" onPress={addMockData} />
        <Button title="clear data" onPress={clearData} />
        <Link href="../about">to About</Link>
      </View>
    );
  };


  export default dashboard;