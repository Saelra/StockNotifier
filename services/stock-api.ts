import { restClient } from '@polygon.io/client-js';

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

const rest = restClient(process.env.POLY_API_KEY);

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
export const fetchStockDaily = async (stockSymbol: string): Promise<number> => {

    let stockPrice: number = -1;

    rest.stocks.dailyOpenClose(stockSymbol, formatDateISO(new Date())).then((data) => {
    	console.log(data);
        if (data.close !== undefined) {
            stockPrice = data.close as number;
        }
    }).catch(e => {
    	console.error(e);
    });
    return stockPrice;
}

const validTimeSpans = ["minute", "hour", "day", "week", "month", "year"];

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
export const fetchStockAggregate = async (stockSymbol: string, timeSpan: string, incrementAmount: number, incrementMultiplier = 1): Promise<number[]> => {

    let stockAggregate: number[] = [];

    // Check if the time span is valid (contained in the array of known values).
    if (validTimeSpans.indexOf(timeSpan.toLowerCase().trim()) == -1) {
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

        // Fetch the aggregate stock data.
        rest.stocks.aggregates(stockSymbol, incrementMultiplier, timeSpan, formatDateISO(startingDate), formatDateISO(new Date()), {sort: 'asc'}).then((data) => {
            console.log(data);
            // Check that the data and closest price is present then add it.
            if (data.results) {
                stockAggregate = data.results
                .filter(result => result.c !== undefined)
                .map(result => result.c as number);
            }
        }).catch(e => {
            console.error(e);
        });
    }
    return stockAggregate;
}