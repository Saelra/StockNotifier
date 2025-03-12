import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Settings: React.FC = () => {
  const [minPercentage, setMinPercentage] = useState<number>(0);
  const [maxPercentage, setMaxPercentage] = useState<number>(100);
  const router = useRouter();

  useEffect(() => {
    // Retrieve saved values from AsyncStorage
    const fetchValues = async () => {
      try {
        const min = await AsyncStorage.getItem('minPercentage');
        const max = await AsyncStorage.getItem('maxPercentage');
        if (min !== null) setMinPercentage(parseFloat(min));
        if (max !== null) setMaxPercentage(parseFloat(max));
      } catch (error) {
        console.error('Error retrieving values:', error);
      }
    };
    fetchValues();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('minPercentage', minPercentage.toString());
      await AsyncStorage.setItem('maxPercentage', maxPercentage.toString());
      // Navigate back to the previous screen
      router.back();
    } catch (error) {
      console.error('Error saving values:', error);
    }
  };

  return (
    <View style={styles.container}>
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