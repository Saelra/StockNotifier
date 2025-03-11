import { restClient } from '@polygon.io/client-js';
const rest = restClient(process.env.POLY_API_KEY);

const timeSpans = ["minute", "hour", "day", "week", "month", "year"];

/**
 * Converts Date object into 'yyyy-mm-dd' format and into a string.
 *
 * @param date - A Date object
 * @returns The Date object as a string in the 'yyyy-mm-dd' format.
 */
const formatDateISO = (date: Date) => {

    // Convert the date to an ISO string.
    const isoString = date.toISOString();
    // Split at the "T" character to get only the date.
    const formattedDate = isoString.split("T")[0];

    return formattedDate;
};

/**
 * Fetches the stock data of the current date.
 *
 * Link: https://polygon.io/docs/stocks/get_v1_open-close__stocksticker___date
 *
 * @remarks
 * This method provides a simple way to get the current data of a stock.
 *
 * @param stockSymbol The symbol of the stock
 */
export const fetchStockResult = async (stockSymbol: string) => {

    rest.stocks.dailyOpenClose(stockSymbol, formatDateISO(new Date())).then((data) => {
    	console.log(data);
    }).catch(e => {
    	console.error(e);
    });
}

// Structure of the stock aggregate data.
interface StockAggregate {

    adjusted: boolean, // Whether or not this response was adjusted for splits.
    next_url?: string, // If present, this value can be used to fetch the next page of data.
    queryCount: number, // The number of aggregates (minute or day) used to generate the response.
    request_id: string, // A request id assigned by the server.
    results: Array<{
        c: number, // The close price for the symbol in the given time period.
        h: number, // The highest price for the symbol in the given time period.
        l: number, // The lowest price for the symbol in the given time period.
        n: number, // The number of transactions in the aggregate window.
        o: number, // The open price for the symbol in the given time period.
        otc?: number, // Whether or not this aggregate is for an OTC ticker. This field will be left off if false.
        t: number, // The Unix Msec timestamp for the start of the aggregate window.
        v: number, // The trading volume of the symbol in the given time period.
        vw: number // The volume weighted average price.
      }>,
    resultsCount: number, // The total number of results for this request.
    status: string, // The status of this request's response.
    ticker: string // The exchange symbol that this item is traded under.
}

/**
 * Fetches an aggregation of stock data over a set time span.
 *
 * Link: https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to
 *
 * @remarks
 * This method can be used for populating graphs and charts.
 * The increment multiplier is optional, it is only practical for the minute increment.
 *
 * @param stockSymbol - The symbol of the stock
 * @param timeSpan - The increment of time to use
 * @param incrementAmount - The number of increments to use
 * @param incrementMultiplier - The amount of time per increment
 */
export const fetchStockAggregate = async (stockSymbol: string, timeSpan: string, incrementAmount: number, incrementMultiplier = 1): Promise<StockAggregate> => {

    let stockAggregate: StockAggregate = {
        adjusted: false,
        queryCount: 0,
        request_id: '',
        results: [],
        resultsCount: 0,
        status: '',
        ticker: ''
    };

    // Check if the time span is valid (contained in the array of known values).
    if (timeSpans.indexOf(timeSpan.toLowerCase().trim()) == -1) {
        console.error("Not a valid time span. Please use 'minute', 'hour', 'day', 'week', 'month', or 'year'");
    } else {

        let startingDate = new Date();

        // Set the correct starting date.
        switch (timeSpan) {
            case "day": {
                startingDate.setDate(startingDate.getDate() - incrementAmount);
                break;
            }
            case "week": {
                startingDate.setDate(startingDate.getDate() - (7 * incrementAmount));
                break;
            }
            case "month": {
                startingDate.setMonth(startingDate.getMonth() - incrementAmount);
                break;
            }
            case "year": {
                startingDate.setFullYear(startingDate.getFullYear() - incrementAmount);
                break;
            }
        }

        // fetch the aggregate stock data.
        rest.stocks.aggregates(stockSymbol, incrementMultiplier, timeSpan, formatDateISO(startingDate), formatDateISO(new Date()), {sort: 'asc'}).then((data) => {
            console.log(data);
            stockAggregate = data as unknown as StockAggregate;
        }).catch(e => {
            console.error(e);
        });
    }
    return stockAggregate;
}