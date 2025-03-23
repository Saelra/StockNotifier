import React from "react";
import {View, Button, TouchableOpacity} from "react-native";
import {Link} from "expo-router";
import DashBoardHeader from '@/components/DashBoardHeader';
import BasicChart from '@/components/BasicChart';
import Symbol from '@/components/Symbol';
import PriceDisplay from '@/components/PriceDisplay';
import History from '@/components/HistoryExample'
import {useState, useEffect} from "react"
import { setData, getData } from '../services/stock-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import alertNotification, { AlertType } from '../components/priceNotificationElement';
import { backgroundFetchTask } from "@/services/stock-fetch";

/**
 * object to hold a single history event
 * Is positive used to show if the price went up or down. 
 */
type historyObject = {
  dateOccurrence : Date,
  isPositive: boolean,
  priceDifference : number
}

/**
 * used in debugging 
 */
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

/**
 * object to hold the price information displayed in the dashboard
 */
type priceInformation = {
  price: number;
  priceDelta : number;
  percentIncrease: number;
}

/**
 * object used to hold the symbol information on the dashboard
 */
type symbolInformation = {
  name: string;
  symbol: string;
}

/**
 * this object holds the ohter objects for storage in the phone.
 * If the user closeds the application and hten reopens, this is the
 * storage object that will be retrieved to reset the data
 */
export interface stockInformation {
  priceI : priceInformation;
  symbolI: symbolInformation;
  graphP: number[];
  min: number;
  max: number;
}

/**
 * The funciton for creating the dashboard object
 * @returns the Dashobard react object. its the top layer in the dashboard page.
 */
const Dashboard : React.FC = () => {

  
  const [dataState, setDataState] = useState([0]);
  const [priceInfo, setPriceInfo] = useState<priceInformation>({price: 0, priceDelta: 0, percentIncrease: 0})
  const [symbolInfo, setSymbolInfo] = useState<symbolInformation>({name : "-----", symbol: "---" })
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [historyList, setHistoryList] = useState<historyObject[]>([]);
  const [ticker, setTicker] = useState<string >("appl");

  /**
   * objec that is used in the Ticker object
   * @param data 
   */
  const handleTickerDataSelect = (data: string) => {
    setTicker(data);
    const newSymbolInformation: symbolInformation = {
      name: 'need API return name',
      symbol: data
    }
    changeSymbol(newSymbolInformation);
  };

  /**
   * This function is used to send data to storage
   * @param key is a sting used to key the stored object
   * @param data is the object being stored 
   */
  const setHistoryData = async (key : string, data: historyObject[]  ) => {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      console.log(`Data has been saved to ${key}.`);
    } catch (error) {
      console.error(`Error saving data to ${key}:`, error);
    }
  }

  /**
   * Function to send and retrieve data from stroage.
   * @param key is used to identify the object to retireve from storage
   * @returns the object that was in storage
   */
  const getHistoryData = async (key: string): Promise<historyObject[] > => {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      return jsonData != null ? JSON.parse(jsonData) : [];
    } catch (error) {
      console.error(`Error getting data from ${key}:`, error);
      return [];
    }
  }

  /**
   * Function to set the symbol inforamtion, it also clear the rest of the dashboad 
   * since with a new symbol, the information will change.
   * @param sym is a symbolInformaiton Object that holds the new symbol
   */
  function changeSymbol(sym: symbolInformation):void {
    setHistoryData(sym.symbol,historyList);
    clearData();
    console.log("getting history data");
    setSymbolInfo(sym);
    //pull from history the history :)
    // updateCurrentStockInfo();

    // Set stock symbol in async storage
    setData<string>("stockSymbol", sym.symbol);

    // Fetch new stock data from API
    backgroundFetchTask();
  }

  /**
   * will update every time the symbolInfo is updated
   */
  useEffect(() => {
    if (symbolInfo.symbol !== "---") { // check if symbolInfo is properly updated
      updateCurrentStockInfo();
    }
  }, [symbolInfo]);

  /**
   * used to se the use state "current stock information"
   */
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

  /**
   * this useEffect is ran only at the start of the dashboad opening
   * It calls storage to get the informaiton to populate the dashboard data.
   */
  useEffect(() => {
    console.log("useEffect active"); //remove me for production!
    getData<stockInformation>('userStockInfo').then(value => {
      if (value) {
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

  /**
   * function to update stock it will setcurrent stock info 
   */
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

  /**
   * funciton to add a new history item
   * @param price current price
   * @param threshold what the threshold is set at
   * @param priceDelta what the change in price is
   */
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

  /**
   * this funciton will add the price to history, graph and update the saved data in stroage, 
   * it will also update the displayed price.
   * @param newStockPrice the new stock price number
   */
  async function addPrice(newStockPrice : number) : Promise<void> {
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
    if (newPriceInfo.price > maxValue) {
      const userWantsToKeep = await alertNotification({
        stock: currentStockInfo,
        threshold: maxValue,
        alertType: AlertType.High,
      });

      if (userWantsToKeep) {
        addNewHistoryObject(newPriceInfo.price, maxValue, newPriceInfo.priceDelta);
      }
    } else if (newPriceInfo.price < minValue) {
      const userWantsToKeep = await alertNotification({
        stock: currentStockInfo,
        threshold: minValue,
        alertType: AlertType.Low,
      });

      if (userWantsToKeep) {
        addNewHistoryObject(newPriceInfo.price, minValue, newPriceInfo.priceDelta);
      }
    }

    setPriceInfo(newPriceInfo);

    updateCurrentStockInfo();
  }

  /**
   * debugging tool to add mock data to the dashboard graph
   */
  function addMockData(){
    const num = (Math.random() * (600 - 400 + 1)) + 400;
    addPrice(num);
  }

  /**
   * function to clear the data from the dashboard
   */
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


  /**
   * return the react object
   */
  return (
      <View>
        <DashBoardHeader onTickerDataSelect={handleTickerDataSelect}/>
        <Symbol name={symbolInfo.name} symbol={symbolInfo.symbol}/>
        <PriceDisplay price={priceInfo.price} priceDelta={priceInfo.priceDelta} percentIncrease={priceInfo.percentIncrease}/>
        <TouchableOpacity>
          <Link href="../detail">
            <BasicChart stockPrices={dataState} />
          </Link>
        </TouchableOpacity>
        <History historyList = {historyList}/>
        <Button title="Add MOck Data" onPress={addMockData} />
        <Button title="clear data" onPress={clearData} />
        <Link href="../about">to About</Link>
      </View>
    );
  };


  export default Dashboard;