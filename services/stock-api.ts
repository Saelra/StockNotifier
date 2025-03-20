import { restClient } from '@polygon.io/client-js';

/**
 * Converts a Date object into the 'yyyy-mm-dd' format and returns it as a string.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} - The formatted date string in 'yyyy-mm-dd' format.
 */
const formatDateISO = (date: Date): string => {

	// Convert the date to an ISO string and split at the "T" character to get only the date.
	return date.toISOString().split('T')[0];
};

const rest = restClient("8W1AIBVUlCB6VhhFFZdwtFFF_8Rfvn9B");

/**
 * Fetches the stock price for the current date.
 *
 * @link https://polygon.io/docs/stocks/get_v1_open-close__stocksticker___date
 * @remarks This method provides a simple way to retrieve the current stock data.
 * @param {string} stockSymbol - The stock symbol to fetch the price for.
 * @returns {Promise<number>} - A promise that resolves to the stock price as a number. Returns -1 if the price could not be retrieved.
 */
export const fetchStockDaily = async (stockSymbol: string): Promise<number> => {
	try {
		const data = await rest.stocks.dailyOpenClose(stockSymbol, formatDateISO(new Date()));
		console.log(data);
		return data.close ?? -1; // Use nullish coalescing operator to return -1 if close is undefined
	} catch (e) {
		console.error(e);
		return -1;
	}
};

const validTimeSpans = ["minute", "hour", "day", "week", "month", "year"];

/**
 * Fetches an aggregation of stock data over a specified time span.
 *
 * @link https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to
 * @remarks This method can be used for populating graphs and charts.
 *          The increment multiplier is optional and is only practical for the minute increment.
 * @param {string} stockSymbol - The stock symbol to fetch the data for.
 * @param {string} timeSpan - The increment of time to use (e.g., 'minute', 'hour', 'day').
 * @param {number} incrementAmount - The number of increments to use.
 * @param {number} [incrementMultiplier=1] - The amount of time per increment (default is 1).
 * @returns {Promise<number[]>} - A promise that resolves to an array of stock prices.
 */
export const fetchStockAggregate = async (stockSymbol: string, timeSpan: string, incrementAmount: number, incrementMultiplier: number = 1): Promise<[number[], string[]]> => {

	const lowerCaseTimeSpan = timeSpan.toLowerCase().trim();

	if (!validTimeSpans.includes(lowerCaseTimeSpan)) {
		console.error("Not a valid time span. Please use 'minute', 'hour', 'day', 'week', 'month', or 'year'");
	}
	const startingDate = new Date();

	// Set the correct starting date based on the time span.
	switch (lowerCaseTimeSpan) {
		case "day":
			startingDate.setDate(startingDate.getDate() - incrementAmount);
			break;
		case "week":
			startingDate.setDate(startingDate.getDate() - (7 * incrementAmount));
			break;
		case "month":
			startingDate.setMonth(startingDate.getMonth() - incrementAmount);
			break;
		case "year":
			startingDate.setFullYear(startingDate.getFullYear() - incrementAmount);
			break;
	}
	let stockAggregate: number[] = [];
	let dateAggregate: string[] = [];

	try {
		const data = await rest.stocks.aggregates(
			stockSymbol,
			incrementMultiplier,
			lowerCaseTimeSpan,
			formatDateISO(startingDate),
			formatDateISO(new Date()),
			{ sort: 'asc' }
		);
		console.log(data);

		if (data.results) {
			// Create list of stock prices as numbers
			stockAggregate = data.results
				.filter(result => result.c !== undefined)
				.map(result => result.c as number);
			// Create list of stock dates as strings
			dateAggregate = data.results
				.filter(result => result.t !== undefined)
				.map(result => formatDateISO(new Date(result.t as number * 1000)));
		}
	} catch (e) {
		console.error(e);
	}
	return [stockAggregate, dateAggregate]
};

/**
 * Searches for stock tickers that match the user's query.
 *
 * @param {string} query - The stock ticker or company name to search for.
 * @returns {Promise<string[]>} - A promise that resolves to an array of matching stock symbols (up to 5 results).
 */
export const searchStockTickers = async (query: string): Promise<string[]> => {

	let stockSymbols: string[] = [];

	// Prevent empty searches
	if (!query.trim()) return stockSymbols;

	try {

		console.log("Fetching stock tickers for:", query);

		const response = await rest.reference.tickers({
			search: query.toUpperCase(),
			active: "true",
			limit: 5,
		});

		if (response && response.results) {
			stockSymbols = response.results.map((ticker) => ticker.ticker);
		}
	} catch (error: any) {

		console.error("Error fetching stock tickers:", error.response ? error.response.data : error.message);

		// Handle rate limit errors (HTTP 429)
		if (error.response?.status === 429) {

			console.warn("Rate limit exceeded. Retrying in 5 seconds...");
			await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
			return searchStockTickers(query); // Retry the request
		}
		throw new Error(error.response?.data || error.message || "Error fetching stock data.");
	}
	return stockSymbols
};