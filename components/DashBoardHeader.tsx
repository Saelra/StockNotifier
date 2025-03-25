import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { searchStockTickers } from "../services/stock-api";
import { useRouter } from "expo-router"; 

interface dbHeaderProps {
  onTickerDataSelect: (data: string) => void;
}

/**
 * Serch bar component for searching stock tickers and navigating to the settings page.
 * @param {dbHeaderProps} props - The props for dbHeader component.
 * @returns {JSX.Element} The rendered component.
 */
const dbHeader = ({ onTickerDataSelect }: dbHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickers, setFilteredTickers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  /**
   * hook to handle search query updates and filter stock tickers.
   */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTickers([]);
      setErrorMessage(null);
      return;
    }

    const delaySearch = setTimeout(async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const matches = await searchStockTickers(searchQuery);
        setFilteredTickers(matches.slice(0, 5));
      } catch (error: any) {
        console.error(error);

        if (error.response?.status === 429) {
          setErrorMessage("Too many requests. Please wait and try again.");
        } else {
          setErrorMessage("Error fetching stock data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }, 500); // Delay to avoid excessive requests

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  /**
   * Not sure what the ticker is did not write this function but the ticker
   * is passed to the settign page
   * @param ticker symbol 
   */
  const handleTickerSelect = (ticker: string) => {
    setSearchQuery("");
    onTickerDataSelect(ticker);
    setFilteredTickers([]);
  };

  /**
   * function to route to the setting page
   */
  const goToSettings = () => {
    router.push('/settings');
  };

  /**
   * function to route to the notification history page
   */
  const goToNotificationHistory = () => {
    router.push('/history');
  };

  /**
   * the rentered object returned to the dashboard
   */
  return (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#000" style={styles.searchIcon} />
        <TextInput
          placeholder="Search Stocks"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {loading && (
          <Icon
            name="spinner"
            size={18}
            color="#007AFF"
            style={styles.loadingIcon}
          />
        )}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {filteredTickers.length > 0 && !errorMessage && (
        <View style={styles.suggestions}>
          <FlatList
            data={filteredTickers}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleTickerSelect(item)} // Pass ticker string on selection
              >
                <Icon
                  name="chart-line"
                  size={16}
                  color="#007AFF"
                  style={styles.stockIcon}
                />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={goToNotificationHistory} style={styles.iconWrapper}>
          <Icon name="bell" size={24} color="#000" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToSettings} style={styles.iconWrapper}>
          <Icon name="cog" size={24} color="#000" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


/**
 * CSS styling!
 */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 5,
  },
  loadingIcon: {
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  suggestions: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stockIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginLeft: 15,
  },
  icon: {
    marginLeft: 10,
  },
});

export default dbHeader;