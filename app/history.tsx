import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { getHistoryData } from "@/components/priceNotificationElement"; // Import your getHistoryData function
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";

/**
 * NotificationHistoryPage component that fetches and displays a list of notifications.
 *
 * @returns {JSX.Element} The rendered NotificationHistoryPage component.
 */
const NotificationHistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);

  // Fetch the notification history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      const storedHistory = await getHistoryData("notificationHistory");
      setHistory(storedHistory);
    };

    fetchHistory();
  }, []);

  /**
   * Renders a single item in the notification history list.
   * 
   * @param {Object} props - The props passed to the render function.
   * @param {Object} props.item - A single notification history item.
   * @returns {JSX.Element} The rendered notification item.
   */
  const renderHistoryItem = ({ item }: { item: any }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>
        <Text style={styles.dateText}>
          {new Date(item.dateOccurrence).toLocaleString()} {"\n"}
        </Text>
        {item.message}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Link href="../dashboard" asChild>
        <Pressable>
          <Ionicons
            style={styles.backButton}
            name="arrow-back"
            size={30}
            color={"black"}
            testID="back-button"
          />
          <Text style={styles.title}> Notification History</Text>
        </Pressable>
      </Link>
      {history.length === 0 ? (
        <Text style={styles.noHistoryText}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

/**
 * Styles for the NotificationHistoryPage component.
 * 
 * @constant
 * @type {Object}
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noHistoryText: {
    fontSize: 16,
    color: "gray",
  },
  historyItem: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
  },
  historyText: {
    fontSize: 16,
  },
  dateText: {
    fontWeight: "bold",
  },
  backButton: {
    paddingTop: 15,
  },
});

export default NotificationHistoryPage;
