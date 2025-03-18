import { getCurrentSlope, getCurrentPrice, getSlopeAverage, getPriceAverage, getChangeAmount, getChangePercentage, getTransactionAmount, getVolumeAmount } from '@/services/stock-calculator';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Dimensions } from 'react-native';
import { setData, getData } from '../services/stock-storage';
import BasicChart from '@/components/BasicChart';

// Interface defining the props for the Detail component.
interface DetailProps {
  stockSymbol: string;
}

/**
 * Detail component that displays detailed stock information based on the provided stock symbol.
 * It includes a chart, time range selection, and various stock metrics.
 *
 * @param {DetailProps} props - The properties passed to the component.
 * @returns {JSX.Element} - The rendered component.
 */
const Detail: React.FC<DetailProps> = ({ stockSymbol }: DetailProps): JSX.Element => {

  // State variable for the radio button time-range options.
  const [timeRange, setTimeRange] = useState('day');
  const timeRanges = ['day', 'week', 'month', 'year', 'max'];

  // State variables for each info box, initialized to null
  const [currentSlope, setCurrentSlope] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [slopeAvg, setSlopeAvg] = useState<number | null>(null);
  const [priceAvg, setPriceAvg] = useState<number | null>(null);
  const [chg, setChg] = useState<number | null>(null);
  const [chgPercent, setChgPercent] = useState<number | null>(null);
  const [transactionAmount, setTransactionAmount] = useState<number | null>(null);
  const [volume, setVolume] = useState<number | null>(null);

  // State variable to store the timestamp of the last data fetch
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  // Effect to update the info box values when the time range or stock symbol changes
  useEffect(() => {

    // Collection of set and get functions
    const fetchData = () => {
      setCurrentSlope(getCurrentSlope(-1));
      setCurrentPrice(getCurrentPrice(-1));
      setSlopeAvg(getSlopeAverage(-1));
      setPriceAvg(getPriceAverage(-1));
      setChg(getChangeAmount(-1));
      setChgPercent(getChangePercentage(-1));
      setTransactionAmount(getTransactionAmount(-1));
      setVolume(getVolumeAmount(-1));
      // Update the last fetch time
      setLastFetchTime(new Date());
    };

    // Fetch data if it doesn't exist yet or if it has been at least 15 minutes since the last fetch
    if (!lastFetchTime || (new Date().getTime() - lastFetchTime.getTime()) >= 15 * 60 * 1000) {
      fetchData();
      setData("stockDetails", {
        currentSlope: currentSlope,
        currentPrice: currentPrice,
        slopeAvg: slopeAvg,
        priceAvg: priceAvg,
        chg: chg,
        chgPercent: chgPercent,
        transactionAmount: transactionAmount,
        volume: volume,
      });
    } else {
      // TODO: use data from async storage if available
      let stockDetails = getData("stockDetails");
    }
  }, [timeRange, stockSymbol]);

  /**
   * Helper function to format numbers with a percentage sign.
   * If the value is null, it returns a dash ('-').
   *
   * @param {number | null} value - The number to format.
   * @returns {string} - The formatted string with a percentage sign.
   */
  const formatPercentage = (value: number | null): string => {
    if (value === null) return '-';
    return `${value.toFixed(2)}%`;
  };

  /**
   * Helper function to format prices with a dollar sign and two decimal places.
   * If the value is null, it returns a dash ('-').
   *
   * @param {number | null} value - The price to format.
   * @returns {string} - The formatted string with a dollar sign.
   */
  const formatPrice = (value: number | null): string => {
    if (value === null) return '-';
    return `$${value.toFixed(2)}`;
  };

  /**
   * Helper function to format change amounts with two decimal places.
   * If the value is null, it returns a dash ('-').
   *
   * @param {number | null} value - The change amount to format.
   * @returns {string} - The formatted string.
   */
  const formatChange = (value: number | null): string => {
    if (value === null) return '-';
    return value.toFixed(2);
  };

  /**
   * Helper function to format volume and transaction amounts with commas.
   * If the value is null, it returns a dash ('-').
   *
   * @param {number | null} value - The volume or transaction amount to format.
   * @returns {string} - The formatted string with commas.
   */
  const formatVolume = (value: number | null): string => {
    if (value === null) return '-';
    return value.toLocaleString();
  };

  // Get screen dimensions
  const { width, height } = Dimensions.get('window');

  // Calculate chart dimensions
  const chartWidth = width * 0.9;
  const chartHeight = height * 0.275;

  return (
    <View style={styles.container}>
      {/* Back button to navigate back to the dashboard */}
      <Link href="../dashboard" asChild>
        <Pressable>
          <Ionicons style={styles.backButton} name="arrow-back" size={30} color={"black"} />
        </Pressable>
      </Link>
      {/* Stock price chart */}
      <View style={styles.graphContainer}>
        <BasicChart chartData={[1, 3, 2, 4, 5]} chartWidth={chartWidth} chartHeight={chartHeight} />
      </View>
      {/* Time range radio buttons */}
      <View style={styles.timeRangeContainer}>
        {timeRanges.map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              timeRange === range ? styles.selectedTimeRangeButton : null,
            ]}
            onPress={() => setTimeRange(range)}>
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === range ? styles.selectedTimeRangeButtonText : null,
              ]}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Info boxes displaying various stock metrics */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Current Price</Text>
          <Text style={styles.infoValue}>{formatPrice(currentPrice)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Average Price</Text>
          <Text style={styles.infoValue}>{formatPrice(priceAvg)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Current Slope</Text>
          <Text style={styles.infoValue}>{formatPercentage(currentSlope)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Average Slope</Text>
          <Text style={styles.infoValue}>{formatPercentage(slopeAvg)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Change Amount</Text>
          <Text style={styles.infoValue}>{formatChange(chg)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Change Percentage</Text>
          <Text style={styles.infoValue}>{formatPercentage(chgPercent)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Transaction Amount</Text>
          <Text style={styles.infoValue}>{formatVolume(transactionAmount)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Trading Volume</Text>
          <Text style={styles.infoValue}>{formatVolume(volume)}</Text>
        </View>
      </View>
    </View>
  );
};

// Stylesheet for the component
const styles = StyleSheet.create({
  backButton: {
    paddingBottom: 16
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  graphContainer: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  selectedTimeRangeButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  timeRangeButtonText: {
    color: '#333',
  },
  selectedTimeRangeButtonText: {
    color: '#fff',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoBox: {
    width: '48%',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default Detail;