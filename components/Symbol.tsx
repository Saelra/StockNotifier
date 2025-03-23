import React from "react";
import {View, Text, StyleSheet } from "react-native";


type symbolProps = {
    symbol?: string,
    name?: string
};

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