import React from "react";  
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";


type historyProp =  {
    hDate : string,
    isPositive : boolean,
    priceDifference : number

}



const HistoryItem = ({hDate, isPositive, priceDifference} : historyProp) => {
    if(!hDate){
      return (null);
    }

    return (
        <>
        <View style={styles.container}>
            <Ionicons name="alert-circle" size={35} />
            <Text > {hDate}</Text>
            <Ionicons name="trash" size={35} style={styles.trashStyle}/>
        </View>
            <Text style ={{color : isPositive? "green" : "red", marginLeft: 45}}> stock price {isPositive? "above" : "below"} threshold by {priceDifference.toFixed(2)} </Text>
        </>
    )
}

export default HistoryItem;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  descriptionStyle  : {
    flex:1,
    marginLeft: 45

  },

  trashStyle : {
    marginLeft: "auto" 
  }

});