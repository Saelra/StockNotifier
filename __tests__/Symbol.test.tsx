import React from 'react';
import { render } from "@testing-library/react-native";
import SymbolHeader from "../components/Symbol";

jest.mock("expo-router", () => ({
    router: {
        push: jest.fn(),
    },
}));

describe("Test the Symbol Component", () => {
    it("Check rendering of the Symbol component and its text", () => {
        const symbolData = {
            name: "mockName",
            symbol : "mockSymbol"
        }

        const {getByText} = render(<SymbolHeader
            name={symbolData.name}
            symbol={symbolData.symbol}/>);
        
        expect(getByText("mockName (mockSymbol)")).toBeTruthy();

    })
})