import React from "react";
import { render } from "@testing-library/react-native";
import HistoryItem from "../components/HistoryItem";

jest.mock("expo-router", () => ({
    router: {
        push: jest.fn(),
    },
}));

jest.mock("expo-font");

describe("History Item Component", () =>{
    it ('Renders the Histroy Item', () => {
        const historyItemData = {mockDate : new Date(), mockIsPositive: true, mockPriceDifference : 10}


        const { getByText} = render(<HistoryItem
            hDate={historyItemData.mockDate}
            isPositive={historyItemData.mockIsPositive}
            priceDifference={historyItemData.mockPriceDifference}/>
         )

        expect(getByText(historyItemData.mockDate.toLocaleDateString())).toBeTruthy();
        expect(getByText('stock price above threshold by 10.00 ')).toBeTruthy();
    })
})