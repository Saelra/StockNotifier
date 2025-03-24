import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PriceDisplay from "../components/PriceDisplay";
import { router } from "expo-router";

jest.mock("expo-router", () => ({
    router: {
      push: jest.fn(),
    },
  }));

jest.mock("expo-font");

describe (" Price Display Component", () => {
    const priceDisplayData = {
        mockPrice : 400, mockDelta : 1, mockIncrease: 10
    }

    const date = new Date();
    const monthName = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    it("test the price Dispaly Component", () => {

        const { getByText } = render(< PriceDisplay
            price={priceDisplayData.mockPrice}
            priceDelta={priceDisplayData.mockDelta}
            percentIncrease={priceDisplayData.mockIncrease}
        />)
    
       expect(getByText(`${monthName[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`)).toBeTruthy();
       expect(getByText("+$1.00 (10.00%)")).toBeTruthy();
       expect(getByText("$400.00")).toBeTruthy();
        });
    });



