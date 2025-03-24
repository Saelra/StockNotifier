import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Recursively converts Date objects to ISO strings.
 * @param data - The data to be converted.
 * @returns The converted data.
 */
const convertDatesToStrings = (data: any): any => {
  if (data instanceof Date) {
    return data.toISOString();
  } else if (Array.isArray(data)) {
    return data.map(convertDatesToStrings);
  } else if (typeof data === 'object' && data !== null) {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = convertDatesToStrings(data[key]);
      return acc;
    }, {} as Record<string, any>);
  } else {
    return data;
  }
};

/**
 * Recursively converts ISO strings back to Date objects.
 * @param data - The data to be converted.
 * @returns The converted data.
 */
const convertStringsToDates = (data: any): any => {
  if (typeof data === 'string' && !isNaN(Date.parse(data))) {
    return new Date(data);
  } else if (Array.isArray(data)) {
    return data.map(convertStringsToDates);
  } else if (typeof data === 'object' && data !== null) {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = convertStringsToDates(data[key]);
      return acc;
    }, {} as Record<string, any>);
  } else {
    return data;
  }
};

/**
 * Saves data to AsyncStorage under the specified key.
 *
 * @template T - The type of the data to be stored.
 * @param {string} key - The key under which the data will be stored in AsyncStorage.
 * @param {T} data - The data to be stored. This can be any serializable JavaScript value.
 * @returns {Promise<void>} - A promise that resolves when the data has been successfully saved.
 * @throws Will log an error message if the data could not be saved.
 */
export const setData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const jsonData = JSON.stringify(convertDatesToStrings(data));
    await AsyncStorage.setItem(key, jsonData);
    console.log(`Data has been saved to ${key}.`);
  } catch (error) {
    console.error(`Error saving data to ${key}:`, error);
  }
};

/**
 * Retrieves data from AsyncStorage using the specified key.
 *
 * @template T - The expected type of the data to be retrieved.
 * @param {string} key - The key under which the data is stored in AsyncStorage.
 * @returns {Promise<T | null>} - A promise that resolves to the retrieved data parsed as type T,
 * or null if no data is found or an error occurs.
 * @throws Will log an error message if the data could not be retrieved.
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    return jsonData != null ? convertStringsToDates(JSON.parse(jsonData)) as T : null;
  } catch (error) {
    console.error(`Error getting data from ${key}:`, error);
    return null;
  }
};