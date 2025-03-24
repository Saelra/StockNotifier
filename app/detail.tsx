import { getCurrentSlope, getSlopeAverage, getPriceAverage, getChangeAmount, getChangePercentage } from '@/services/stock-calculator';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from "expo-router";
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Dimensions } from 'react-native';
import { setData, getData } from '../services/stock-storage';
import BasicChart from '@/components/BasicChart';
import { backgroundFetchTask } from '@/services/stock-fetch';
import { formatDate } from '../services/stock-api';

interface TimeRangeData {
  lastFetchTime: Date;
  currentSlope: number | null;
  currentPrice: number | null;
  slopeAvg: number | null;
  priceAvg: number | null;
  chg: number | null;
  chgPercent: number | null;
  transactions: number[] | null;
  volumes: number[] | null;
}

interface StockDetails {
  timeRanges: {
    [key: string]: TimeRangeData;
  };
}


/**
 * Detail component that displays detailed stock information based on the provided stock symbol.
 * It includes a chart, time range selection, and various stock metrics.
 *
 * @returns {JSX.Element} - The rendered component.
 */
const Detail: React.FC = (): JSX.Element => {

  // State variable for the radio button time-range options and their increment amounts
  const [timeRange, setTimeRange] = useState('week');
  const timeRanges = ['week', 'month', 'quarter', 'year'];
  const incrementTimes = ['day', 'week', 'month', 'month'];
  const incrementAmounts = [7, 4, 6, 12];

  const [stockPrices, setStockPrices] = useState<number[] | null>(null);
  const [priceDates, setPriceDates] = useState<Date[] | null>(null);

  // State variables for each info box, initialized to null
  const [currentSlope, setCurrentSlope] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [slopeAvg, setSlopeAvg] = useState<number | null>(null);
  const [priceAvg, setPriceAvg] = useState<number | null>(null);
  const [chg, setChg] = useState<number | null>(null);
  const [chgPercent, setChgPercent] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<number[] | null>(null);
  const [volumes, setVolumes] = useState<number[] | null>(null);

  useEffect(() => {

    const fetchDataAndStore = async () => {

      // Get stock prices and dates
      let fetchedStockPrices = await getData<number[]>("stockPrices") ?? [];
      let fetchedPriceDates = await getData<Date[]>("priceDates") ?? [];

      // Set stock prices and dates
      setStockPrices(fetchedStockPrices);
      setPriceDates(fetchedPriceDates);

      // If stock price data is present, calculate stock details
      if (fetchedStockPrices && fetchedStockPrices.length > 1) {

        // Set new stock details
        setCurrentSlope(getCurrentSlope(fetchedStockPrices[fetchedStockPrices.length-1], fetchedStockPrices[fetchedStockPrices.length-2]));
        setCurrentPrice(fetchedStockPrices[fetchedStockPrices.length-1] ?? null);
        setSlopeAvg(getSlopeAverage(fetchedStockPrices));
        setPriceAvg(getPriceAverage(fetchedStockPrices));
        setChg(getChangeAmount(fetchedStockPrices[fetchedStockPrices.length-1], fetchedStockPrices[fetchedStockPrices.length-2]));
        setChgPercent(getChangePercentage(fetchedStockPrices[fetchedStockPrices.length-1], fetchedStockPrices[fetchedStockPrices.length-2]));
        setTransactions(await getData<number[]>("stockTransactions") ?? null);
        setVolumes(await getData<number[]>("stockVolumes") ?? null);
      }

      // Get time of last fetch for selected time range
      let stockDetails = (await getData<StockDetails>("stockDetails")) ?? { timeRanges: {} };
      let lastFetchTime = stockDetails.timeRanges[timeRange]?.lastFetchTime;

      // Fetch data if it doesn't exist yet or if it has been at least a minute since the last fetch
      if (!lastFetchTime || (new Date().getTime() - new Date(lastFetchTime).getTime()) >= 60 * 1000) {

        let index: number = timeRanges.indexOf(timeRange) ?? 0;

        setData<string>("timeRange", incrementTimes[index] ?? "day");
        setData<number>("incrementAmount", incrementAmounts[index] ?? 0);
        setData<number>("incrementMultiplier", 1);

        backgroundFetchTask();

        await setData<StockDetails>("stockDetails", {
          timeRanges: {
            ...stockDetails.timeRanges, // Preserve existing time ranges
            [timeRange]: {
              lastFetchTime: new Date(),
              currentSlope: currentSlope,
              currentPrice: currentPrice,
              slopeAvg: slopeAvg,
              priceAvg: priceAvg,
              chg: chg,
              chgPercent: chgPercent,
              transactions: transactions,
              volumes: volumes,
            }
          }
        });
      }
    };
    fetchDataAndStore();

  }, [timeRange]);

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
   * Helper function to format value amounts with two decimal places.
   * If the value is null, it returns a dash ('-').
   *
   * @param {number | null} value - The value amount to format.
   * @returns {string} - The formatted string.
   */
  const current = (value: number | null): string => {
    if (value === null) return '-';
    return value.toFixed(2);
  };

  /**
   * Helper function to sum and format volumes and transactions with commas.
   * If values is null, it returns a dash ('-').
   *
   * @param {number[] | null} values - The volumes or transactions to format.
   * @returns {string} - The formatted string with commas.
   */
  const formatSum = (values: number[] | null): string => {
    if (values === null || values.length === 0) return '-';
    return values
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
      .toLocaleString();
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
        <Pressable testID="back-button">
          <Ionicons style={styles.backButton} name="arrow-back" size={30} color={"black"} />
        </Pressable>
      </Link>
      {/* Stock price chart */}
      <View style={styles.graphContainer} testID="graph-container">
        <BasicChart
          stockPrices={!stockPrices || stockPrices.length === 0 ? [0] : stockPrices}
          priceDates={!priceDates || priceDates.length === 0  ? [""] : formatDate(priceDates) as string[]}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
        />
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
            onPress={() => setTimeRange(range)}
            testID={`time-range-button-${range}`}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === range ? styles.selectedTimeRangeButtonText : null,
              ]}
            >
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
          <Text style={styles.infoValue}>{current(currentSlope)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Average Slope</Text>
          <Text style={styles.infoValue}>{current(slopeAvg)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Change Amount</Text>
          <Text style={styles.infoValue}>{formatPrice(chg)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Change Percentage</Text>
          <Text style={styles.infoValue}>{formatPercentage(chgPercent)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Transaction Amount</Text>
          <Text style={styles.infoValue}>{formatSum(transactions)}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Trading Volumes</Text>
          <Text style={styles.infoValue}>{formatSum(volumes)}</Text>
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
    paddingHorizontal: 20,
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