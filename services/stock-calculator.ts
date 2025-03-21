export const getCurrentPrice = (input: number): number => {

	return -1;
};

export const getPriceAverage = (priceArray: number[]): number | null => {
	if (priceArray.length === 0) {
        return null;
    }
    const sum = priceArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / priceArray.length;
    return average;
};

export const getCurrentSlope = (prev: number, latest: number): number => {
	return latest - prev;
};

export const getSlopeAverage = (numbers: number[]): number | null => {
	if (numbers.length < 2) {
        return null;
    }
    let totalSlope = 0;
    for (let i = 1; i < numbers.length; i++) {
        const slope = numbers[i] - numbers[i - 1];
        totalSlope += slope;
    }

    return totalSlope / (numbers.length - 1);
};

export const getChangeAmount = (oldPrice: number, newPrice: number): number => {
	return (oldPrice - newPrice);
};

export const getChangePercentage = (oldPirce: number, newPrice: number): number => {
	return (Math.abs(oldPirce - newPrice) / newPrice) * 100;
};

export const getTransactionAmount = (input: number): number => {

	return -1;
};

export const getVolumeAmount = (input: number): number => {

	return -1;
};