import React from "react";
import {View, Text, StyleSheet, FlatList} from 'react-native';
import HistoryItem from "@/components/HistoryItem"
import Ionicons from "@expo/vector-icons/Ionicons";


const History = () => {
    return (
        <>
            <View style={styles.historyHeader}>
                <Text style={styles.hearder}> Price Notification History </Text>
                <Ionicons name="arrow-forward-outline" size={20} color="black"/>
            </View>
            
            <HistoryItem hDate={new Date()} description="stock price above threshold by $5.36" positive={true}/>
        </>
       
    );
}

export default History;

const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    
    historyHeader: {
      flexDirection: "row",
      alignItems: "center",
      fontSize: 40
    },

    hearder :{
        fontSize: 20
    }
   
  });

 