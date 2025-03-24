import React from "react";
import {View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import HistoryItem from "@/components/HistoryItem"
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

type historyObject = {
    dateOccurrence : Date,
    isPositive: boolean,
    priceDifference : number
}

interface HistoryProps {
    historyList : historyObject[]
};

const goToNotificationHistory = () => {
    router.push('/history');  // Navigate to the settings page
  };

const History : React.FC<HistoryProps> = ({historyList}) => {


    if(historyList.length > 0){return (
        <>
            <SafeAreaView style={styles.historyHeader}>
                <TouchableOpacity onPress={goToNotificationHistory}>
                    <Text style={styles.header}> Price Notification History 
                        <Ionicons name="arrow-forward-outline" size={20} color="black"/>
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
            <FlatList
                data={historyList}
                renderItem={({item}) => <HistoryItem hDate={item.dateOccurrence}  isPositive={item.isPositive} priceDifference={item.priceDifference} />}
                inverted
            />
        </>

    );
}else {return (
    <>
    <Text style={styles.header}> No History Avaiable</Text>
    </>
)}
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

