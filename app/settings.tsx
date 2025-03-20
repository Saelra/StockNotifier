import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { stockInformation } from "./dashboard";

/**
 * Settings Component allows the user to adjust the minimum and maximum price thresholds 
 * for stock alerts and save those values in AsyncStorage.
 * 
 * @component
 * @example
 * return <Settings />;
 */
const Settings: React.FC = () => {
  const [stockInfo, setStockInfo] = useState<stockInformation | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const router = useRouter();

  /**
   * Fetches the stored stock information from AsyncStorage when the component mounts.
   * The information includes the stock symbol, price, and other relevant data.
   */
  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        const stockData = await AsyncStorage.getItem("userStockInfo");
        if (stockData) {
          const parsedStock: stockInformation = JSON.parse(stockData);
          setStockInfo(parsedStock);
        }
      } catch (error) {
        console.error("Error retrieving stock information:", error);
      }
    };
    fetchStockInfo();
  }, []);

  // Ticker and current price are derived from stockInfo or set to default values
  const ticker = stockInfo?.symbolI?.symbol || "N/A";
  const currentPrice = stockInfo?.priceI?.price || 100;
  const sliderMiddle = stockInfo?.priceI?.price || 100;

  /**
   * Fetches the saved minimum and maximum price values for the selected ticker
   * from AsyncStorage when the stockInfo is updated.
   */
  useEffect(() => {
    if (stockInfo) {
      const fetchValues = async () => {
        try {
          const min = await AsyncStorage.getItem(`minPrice-${ticker}`);
          const max = await AsyncStorage.getItem(`maxPrice-${ticker}`);
          // console.log(`Load Min Price for ${ticker}: $${min}`);
          // console.log(`Load Max Price for ${ticker}: $${max}`);

          setMinPrice(min !== null ? parseFloat(min) : sliderMiddle);
          setMaxPrice(max !== null ? parseFloat(max) : sliderMiddle);
        } catch (error) {
          console.error("Error retrieving values:", error);
        }
      };

      fetchValues();
    }
  }, [stockInfo]);

  /**
   * Handles saving the user's selected min and max price values to AsyncStorage.
   * The values are stored with keys based on the stock ticker symbol.
   */
  const handleSave = async () => {
    try {
      if (minPrice !== null && maxPrice !== null) {
        await AsyncStorage.setItem(`minPrice-${ticker}`, minPrice.toString());
        await AsyncStorage.setItem(`maxPrice-${ticker}`, maxPrice.toString());

        // console.log(`Saved Min Price for ${ticker}: $${minPrice.toFixed(2)}`);
        // console.log(`Saved Max Price for ${ticker}: $${maxPrice.toFixed(2)}`);
      }
      router.back();
    } catch (error) {
      console.error("Error saving values:", error);
    }
  };

  // Show a loading message until stockInfo is loaded and values are set
  if (!stockInfo || minPrice === null || maxPrice === null) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.tickerName}>Selected Ticker: {ticker}</Text>
      <Text style={styles.label}>Alert Min: ${minPrice?.toFixed(2)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={currentPrice * 2 || 1000}
        step={0.01}
        value={minPrice}
        onValueChange={setMinPrice}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#8ED1FC"
        thumbTintColor="#1EB1FC"
      />
      <Text style={styles.label}>Alert Max: ${maxPrice?.toFixed(2)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={currentPrice * 2 || 1000}
        step={0.01}
        value={maxPrice}
        onValueChange={setMaxPrice}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#8ED1FC"
        thumbTintColor="#1EB1FC"
      />
      <Button title="Save Settings" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tickerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default Settings;