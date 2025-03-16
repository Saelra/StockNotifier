import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

const Detail: React.FC = () => {

  const [timeRange, setTimeRange] = useState('day');
  const timeRanges = ['day', 'week', 'month', 'year', 'max'];

  return (
    <View style={styles.container}>
			  <Link href="../dashboard" asChild>
          <Pressable>
            <Ionicons style={styles.backButton} name="arrow-back" size={30} color={"black"} />
          </Pressable>
        </Link>
      <View style={styles.graphContainer}>
        <Text>Stock Price Graph</Text>
      </View>
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
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Current Slope</Text>
          <Text style={styles.infoValue}>2.5%</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Current Price</Text>
          <Text style={styles.infoValue}>$180.00</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Average Slope</Text>
          <Text style={styles.infoValue}>1.5%</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Average Price</Text>
          <Text style={styles.infoValue}>$175.00</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>CHG</Text>
          <Text style={styles.infoValue}>+5.00</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>CHG %</Text>
          <Text style={styles.infoValue}>+2.86%</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Dow Jones Avg</Text>
          <Text style={styles.infoValue}>36,000.00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
	backButton : {
		paddingBottom : 16
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
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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