import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reviver function for JSON.parse to convert ISO strings back to Date objects.
 * @param _key - The key of the object property being parsed.
 * @param value - The value of the object property being parsed.
 * @returns The original value or a new Date object if the value is an ISO string.
 */
const dateReviver = (_key: string, value: unknown): unknown => {

  if (typeof value === 'string') {

    const date = new Date(value);

    // Check if the value is a valid date
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return value;
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
    // Convert Date objects to ISO strings
    const jsonData = JSON.stringify(data, (_k, v) => (v instanceof Date ? v.toISOString() : v));
    await AsyncStorage.setItem(key, jsonData);

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
    return jsonData != null ? (JSON.parse(jsonData, dateReviver) as T) : null;

  } catch (error) {

    console.error(`Error getting data from ${key}:`, error);
    return null;
  }
};