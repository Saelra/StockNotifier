import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { stockInformation } from './dashboard';

const Settings: React.FC = () => {
  const [stockInfo, setStockInfo] = useState<stockInformation | null>(null);
  const [minPercentage, setMinPercentage] = useState<number>(0);
  const [maxPercentage, setMaxPercentage] = useState<number>(50);
  const router = useRouter();

  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        // Retrieve stock information from AsyncStorage
        const stockData = await AsyncStorage.getItem('userStockInfo');
        if (stockData) {
          const parsedStock: stockInformation = JSON.parse(stockData);
          setStockInfo(parsedStock);
        }
      } catch (error) {
        console.error('Error retrieving stock information:', error);
      }
    };

    fetchStockInfo();
  }, []);

  const ticker = stockInfo?.symbolI?.symbol || "N/A";

  useEffect(() => {
    const fetchValues = async () => {
      try {
        // Retrieve the min and max values for the selected ticker from AsyncStorage
        const min = await AsyncStorage.getItem(`minPercentage-${ticker}`);
        const max = await AsyncStorage.getItem(`maxPercentage-${ticker}`);
        if (min !== null) setMinPercentage(parseFloat(min));
        if (max !== null) setMaxPercentage(parseFloat(max));
        console.log(ticker)
      } catch (error) {
        console.error('Error retrieving values:', error);
      }
    };
    fetchValues();
  }, [stockInfo]);

  const handleSave = async () => {
    try {
      // Save the min and max values for the selected ticker to AsyncStorage
      await AsyncStorage.setItem(`minPercentage-${ticker}`, minPercentage.toString());
      await AsyncStorage.setItem(`maxPercentage-${ticker}`, maxPercentage.toString());
      router.back();  // Navigate back to the previous screen
    } catch (error) {
      console.error('Error saving values:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tickerName}>Selected Ticker: {ticker}</Text>
      <Text style={styles.label}>Alert Min: {minPercentage}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={minPercentage}
        onValueChange={setMinPercentage}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#8ED1FC"
        thumbTintColor="#1EB1FC"
      />
      <Text style={styles.label}>Alert Max: {maxPercentage}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={maxPercentage}
        onValueChange={setMaxPercentage}
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
