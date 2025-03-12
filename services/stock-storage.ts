import AsyncStorage from '@react-native-async-storage/async-storage';
import { stockInformation } from '../app/dashboard';

export const setData = async (key : string, data: stockInformation ) => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonData);
    console.log(`Data has been saved to ${key}.`);
  } catch (error) {
    console.error(`Error saving data to ${key}:`, error);
  }
}

export const getData = async (key: string): Promise<stockInformation | null> => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    return jsonData != null ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error(`Error getting data from ${key}:`, error);
    return null;
  }
};