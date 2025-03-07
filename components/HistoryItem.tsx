import React from "react";  
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";


type historyProp =  {
    hDate : Date,
    description : string,
    positive : boolean

}



const HistoryItem = ({hDate, description, positive} : historyProp) => {
    return (
        <>
        <View style={styles.container}>
            <Ionicons name="alert-circle" size={35} />
            <Text > {hDate.getDate()}/{hDate.getMonth()}/{hDate.getFullYear()}</Text>
            <Ionicons name="trash" size={35} style={styles.trashStyle}/>
        </View>
            <Text style ={{color : positive ? "green" : "red", marginLeft: 45}}> {description} </Text>
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
    marginLeft: 45

  },

  trashStyle : {
    marginLeft: 250
  }

});