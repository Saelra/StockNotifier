import React from "react";
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import HistoryItem from "@/components/HistoryItem"
import Ionicons from "@expo/vector-icons/Ionicons";

type historyObject = {
    dateOccurrence : Date,
    isPositive: boolean,
    priceDifference : number
}

interface HistoryProps {
    historyList : historyObject[]
};


const History : React.FC<HistoryProps> = ({historyList}) => {
    return (
        <>
            <SafeAreaView style={styles.historyHeader}>
                <Text style={styles.header}> Price Notification History </Text>
                <Ionicons name="arrow-forward-outline" size={20} color="black"/>
            </SafeAreaView>
            <FlatList
                data={historyList}
                renderItem={({item}) => <HistoryItem hDate={item.dateOccurrence}  isPositive={item.isPositive} priceDifference={item.priceDifference} />}
                inverted
            />
        </>

    );
}

//<HistoryItem hDate={new Date()} description="stock price above threshold by $5.36" positive={true}/>
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

    header :{
        fontSize: 20
    }

  });

