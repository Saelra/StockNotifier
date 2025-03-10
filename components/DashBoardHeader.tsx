import React from "react";
import {View, Text, Button, Image, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import {Link} from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';

const dbHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={() => {
          // Handle settings navigation here
        }}>
          <Icon name="gear" size={25} color="#000" />
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginRight: 10,
      flex: 1,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
    },
    searchIcon: {
      marginRight: 5,
    }
  });
  
  export default dbHeader;