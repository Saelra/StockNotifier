import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface SettingsProps {
  route?: {
    params?: {
      ticker: string;
      min: number;
      max: number;
    };
  };
}

const Settings: React.FC<SettingsProps> = ({ route }) => {
  // Extract ticker, min, and max from route params
  const { ticker = 'DEFAULT', min: initialMin = 0, max: initialMax = 100 } = route?.params || {};

  const [minPercentage, setMinPercentage] = useState<number>(initialMin);
  const [maxPercentage, setMaxPercentage] = useState<number>(initialMax);
  const router = useRouter();

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
  }, [ticker]);

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

export default Settings;
