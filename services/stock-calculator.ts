export const getPriceAverage = (numbers: number[]): number | null => {

	if (!numbers || numbers.length === 0) {
        return null;
    }
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / numbers.length;

    return average;
};

export const getCurrentSlope = (previousNumber: number, currentNumber: number): number | null => {

	if (!previousNumber || !currentNumber) {
        return null;
    }
	return previousNumber - currentNumber / 2;
};

export const getSlopeAverage = (numbers: number[]): number | null => {

	if (!numbers || numbers.length < 2) {
        return null;
    }
    let totalSlope = 0;

    for (let i = 1; i < numbers.length; i++) {
        const slope = numbers[i] - numbers[i - 1];
        totalSlope += slope;
    }
    return totalSlope / (numbers.length - 1);
};

export const getChangeAmount = (previousNumber: number, currentNumber: number): number | null => {

	if (!previousNumber || !currentNumber) {
        return null;
    }
	return (previousNumber - currentNumber);
};

export const getChangePercentage = (previousNumber: number, currentNumber: number): number | null => {

	if (!previousNumber || !currentNumber) {
        return null;
    }
	return (Math.abs(previousNumber - currentNumber) / currentNumber) * 100;
};