import AsyncStorage from '@react-native-async-storage/async-storage';

const setStockData = async (stockData: JSON) => {
    try {
        const jsonValue = JSON.stringify(stockData);
        await AsyncStorage.setItem('@stock_data', jsonValue);
    } catch (e) {
        console.error(e);
    }
  };

const getStockData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@stock_data');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(e);
    }
  };
