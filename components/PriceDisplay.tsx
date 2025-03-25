import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type PriceProps = {
  price: number;
  priceDelta: number;
  percentIncrease: number;
};

/**
 * 
 * @param price is the current price to be displayed
 * @param priceDelta is the differnet between current and new price.
 * @param percentIncrease is the percentage of increase in price.
 * @returns the month in string format
 */
const PriceDisplay = ({ price, priceDelta, percentIncrease }: PriceProps) => {
  const date = new Date();
  const monthName = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.styleDate}>
        {monthName[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
      </Text>

      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>${price.toFixed(2)}</Text>
        <Ionicons
            name={priceDelta >= 0 ? "arrow-up-outline" : "arrow-down-outline"}
            size={15}
            color={priceDelta >= 0 ? "green" : "red"}
        />
        <Text style={{ color: priceDelta >= 0 ? "green" : "red" }}>
            {priceDelta >= 0 ? "+" : ""}${priceDelta.toFixed(2)} ({percentIncrease.toFixed(2)}%)
        </Text>
      </View>

    </View>
  );
};

export default PriceDisplay;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  styleDate: {
    fontSize: 15,
    marginTop: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentPrice: {
    fontSize: 30,
    paddingRight: 5,
  },
});
