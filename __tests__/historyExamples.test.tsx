import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import History from "../components/HistoryExample";
import { router } from "expo-router";

// Mock expo-router navigation
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("expo-font");

describe("History Component", () => {

  it("renders correctly when historyList has data", () => {
    const historyData = [
      { dateOccurrence: new Date(), isPositive: true, priceDifference: 5.36 },
    ];

    const { getByText } = render(<History historyList={historyData} />);

    expect(getByText("Price Notification History")).toBeTruthy();
  });

  it("renders historyList is empty", () => {
    const { getByText } = render(<History historyList={[]} />);

    expect(getByText("No History Avaiable")).toBeTruthy();
  });

  it("routes to history", () => {
    const historyData = [
      { dateOccurrence: new Date(), isPositive: true, priceDifference: 5.36 },
    ];

    const { getByText } = render(<History historyList={historyData} />);
    const historyHeader = getByText("Price Notification History");

    fireEvent.press(historyHeader);

    expect(router.push).toHaveBeenCalledWith("/history");
  });
});
