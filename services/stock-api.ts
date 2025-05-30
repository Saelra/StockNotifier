import { restClient } from '@polygon.io/client-js';

/**
 * Converts a Date object or an array of Date objects into the 'mm/dd/yyyy' format without leading zeros.
 *
 * If any item is not a Date, it returns 'Invalid Date'.
 *
 * @param {Date | Date[]} input - The Date object or array of Date objects to format.
 * @returns {string | string[]} - The formatted date(s) in 'yyyy-mm-dd' format or 'Invalid Date'.
 */
export const formatDate = (input: Date | Date[]): string | string[] => {

  // Helper function to format a single date object
  const formatSingleDate = (date: Date): string => {

		const month = date.getMonth() + 1; // Months are zero-based
		const day = date.getDate();
		const year = date.getFullYear();

		const formattedMonth = month.toString();
		const formattedDay = day.toString();

		return `${formattedMonth}/${formattedDay}/${year}`;
	};

	if (Array.isArray(input)) {
			return input.map(formatSingleDate);
	} else {
			return formatSingleDate(input);
	}
}

/**
 * Converts a Date object into the 'yyyy-mm-dd' format.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} - The date in 'yyyy-mm-dd' format as a string.
 */
export const formatDateISO = (date: Date): string => {

	// Convert the date to an ISO string and split at the "T" character to get only the date.
	return date.toISOString().split('T')[0];
}

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
		return data.close ?? -1;

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
export const fetchStockAggregate = async (stockSymbol: string, timeSpan: string, incrementAmount: number, incrementMultiplier: number = 1): Promise<[number[], Date[], number[], number[]]> => {

	const lowerCaseTimeSpan = timeSpan.toLowerCase().trim();

	let stockAggregate: number[] = [];
	let dateAggregate: Date[] = [];
	let transactionAggregate: number[] = [];
	let volumeAggregate: number[] = [];

	if (!validTimeSpans.includes(lowerCaseTimeSpan)) {
		console.error("Not a valid time span. Please use 'minute', 'hour', 'day', 'week', 'month', or 'year'");
		return [stockAggregate, dateAggregate, transactionAggregate, volumeAggregate]
	}
	const startingDate: Date = new Date();

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

	try {
		const data = await rest.stocks.aggregates(
			stockSymbol,
			incrementMultiplier,
			lowerCaseTimeSpan,
			formatDateISO(startingDate),
			formatDateISO(new Date()),
			{ sort: 'asc' }
		);

		if (data.results) {

			// Retrieve stock prices
			stockAggregate = data.results
				.filter(result => result.c !== undefined)
				.map(result => result.c as number);

			// Retrieve price dates
			dateAggregate = data.results
				.filter(result => result.t !== undefined)
				.map(result => new Date(result.t as number));

			// Retrieve stock transactions
			transactionAggregate = data.results
				.filter(result => result.n !== undefined)
				.map(result => result.n as number);

			// Retrieve stock volumes
			volumeAggregate = data.results
				.filter(result => result.v !== undefined)
				.map(result => result.v as number);
		}
	} catch (e) {
		console.error(e);
	}
	return [stockAggregate, dateAggregate, transactionAggregate, volumeAggregate]
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

			const response = await rest.reference.tickers({
					search: query.toUpperCase(),
					active: "true",
					limit: 5,
			});

			if (response && response.results) {
					stockSymbols = response.results.map((ticker) => ticker.ticker);
			}
	} catch (error: unknown) {

			// Type guard to check if error has response and status properties
			if (typeof error === 'object' && error !== null && 'response' in error) {

					const err = error as { response: { status?: number, data?: string }, message?: string };
					console.error("Error fetching stock tickers:", err.response.data || err.message);

					// Handle rate limit errors (HTTP 429)
					if (err.response.status === 429) {

							console.warn("Rate limit exceeded. Retrying in 5 seconds...");
							await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
							return searchStockTickers(query); // Retry the request
					}
			} else {
					console.error("Error fetching stock tickers:", (error as Error).message);
			}
			throw new Error((error as Error).message || "Error fetching stock data.");
	}
	return stockSymbols;
};