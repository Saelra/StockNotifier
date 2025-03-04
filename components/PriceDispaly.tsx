import React from "react";
import {View, Text, StyleSheet} from 'react-native'

type priceProps = {
    price: number,
    priceDelta: number,
    percentIncrease: number
}
const priceDisplay = ({price, priceDelta, percentIncrease} : priceProps) =>{
   let date = new Date()
   const monthName = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
   
    return (
   <View>
        <Text style={styles.styleDate}>{monthName[date.getMonth()]} {date.getDay()} {date.getFullYear()}</Text>
        <Text style={styles.currentPrice}> {price} </Text>
    </View>
   )


}

export default priceDisplay;

const styles = StyleSheet.create({
    styleDate : {
        fontSize:15,
        paddingLeft: 10,
        marginTop:20
    },

    currentPrice : {
        fontSize: 30,
        paddingLeft: 5
    },

    arrowPointer: {
        
    }
})