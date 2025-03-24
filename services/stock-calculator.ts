/**
 * Calculates the average of an array of numbers.
 *
 * @param numbers - An array of numbers to calculate the average from.
 * @returns The average of the numbers as a number, or null if the input array is empty or not provided.
 */
export const getPriceAverage = (numbers: number[]): number | null => {

    if (!numbers || numbers.length === 0) {
        return null;
    }
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / numbers.length;

    return average;
};

/**
 * Calculates the slope between two numbers.
 *
 * @param previousNumber - The previous number in the sequence.
 * @param currentNumber - The current number in the sequence.
 * @returns The slope as a number, or null if either of the input numbers is not provided.
 */
export const getCurrentSlope = (previousNumber: number, currentNumber: number): number | null => {

    if (!previousNumber || !currentNumber) {
        return null;
    }
    return currentNumber - previousNumber;
};

/**
 * Calculates the average slope of a series of numbers.
 *
 * @param numbers - An array of numbers to calculate the average slope from.
 * @returns The average slope as a number, or null if the input array has fewer than 2 elements or is not provided.
 */
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

/**
 * Calculates the change amount between two numbers.
 *
 * @param previousNumber - The previous number in the sequence.
 * @param currentNumber - The current number in the sequence.
 * @returns The change amount as a number, or null if either of the input numbers is not provided.
 */
export const getChangeAmount = (previousNumber: number, currentNumber: number): number | null => {

    if (!previousNumber || !currentNumber) {
        return null;
    }
    return previousNumber - currentNumber;
};

/**
 * Calculates the percentage change between two numbers.
 *
 * @param previousNumber - The previous number in the sequence.
 * @param currentNumber - The current number in the sequence.
 * @returns The percentage change as a number, or null if either of the input numbers is not provided.
 *          The result is always a positive percentage.
 */
export const getChangePercentage = (previousNumber: number, currentNumber: number): number | null => {

    if (!previousNumber || !currentNumber) {
        return null;
    }
    return (Math.abs(previousNumber - currentNumber) / currentNumber) * 100;
};