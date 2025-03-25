import React from "react";
import {View, Text, StyleSheet } from "react-native";


type symbolProps = {
    symbol?: string,
    name?: string
};

/**
 * 
 * @param symbol is the symbol of the stock
 * @param name is the name of the stock, currently there is no name so
 * we pass the name "Stock Symbol: " 
 * @returns the header object to be sent to the dashboard. 
 */
const SymbolHeader = ({symbol, name} : symbolProps) => {
    return (
        <View>
           <Text
            style={styles.container}
           >
            
             {name} ({symbol})
            </Text>
        </View>
    )

}

export default SymbolHeader;

const styles = StyleSheet.create({
    container: {
        
        marginTop: 10,
        fontSize: 25,
        paddingLeft: 15,
        
        
    },
})