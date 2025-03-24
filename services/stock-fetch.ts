import { getData, setData } from './stock-storage';
import { fetchStockAggregate } from './stock-api';

/**
 * Retrieves meta stock information from async storage, uses this information
 * to fetch aggregated stock data from the API, and then stores the fetched
 * data back into storage.
 *
 * @returns `true` if the process completes without error, else `false`.
 */
export const backgroundFetchTask = async (): Promise<boolean> => {

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
      setData<Date[]>("priceDates", priceDates);
      setData<number[]>("stockTransactions", stockTransactions);
      setData<number[]>("stockVolumes", stockVolumes);
    }
  } catch (error) {
    console.error('Error in background fetch task:', error);
		return false;
  }
	return true
};