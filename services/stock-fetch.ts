import { getData, setData } from './stock-storage'; // Replace with your actual data storage module
import { fetchStockAggregate } from './stock-api'; // Replace with your actual fetch stock module

export const backgroundFetchTask = async (): Promise<boolean> => {

	console.log("background fetch called");

  try {
    // Get meta stock information
    let stockSymbol = await getData<string>("stockSymbol") ?? "AAPL";
    let timeRange = await getData<string>("timeRange") ?? "day";
    let incrementAmount = await getData<number>("incrementAmount") ?? 7;
    let incrementMultiplier = await getData<number>("incrementMultiplier") ?? 1;

    // If meta stock information is present, fetch stock data
    if (stockSymbol && timeRange && incrementAmount && incrementMultiplier) {

			// Fetch stock data
      let [stockPrices, priceDates, stockTransactions, stockVolumes] = await fetchStockAggregate(stockSymbol, timeRange, incrementAmount, incrementMultiplier);

      // If stock data is present then set it, else set empty
      setData<number[]>("stockPrices", stockPrices);
      setData<string[]>("priceDates", priceDates);
      setData<number[]>("stockTransactions", stockTransactions);
      setData<number[]>("stockVolumes", stockVolumes);
    }
  } catch (error) {
    console.error('Error in background fetch task:', error);
		return false;
  }
	return true
};