import React from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import RNFS from 'react-native-fs';
import { Link } from "expo-router";

const About = () => {
    return (
        <View>
            <Link href="../dashboard" asChild>
                <Pressable>
                    <Ionicons style={styles.backButton} name="arrow-back" size={30} color={"black"} />
                </Pressable>
            </Link>
            <Text style={styles.headline}>About Us</Text>
            <Text style={styles.body}> This dream team was created to excel in college and deepen our understanding of computing systems. In this class we will strive to learn the finer details of software Architecture and the exciting world of open-source projects.
            </Text>
        </View>
    );
}

export default About;

const styles = StyleSheet.create({
    backButton : {
        paddingLeft : 15,
        paddingTop : 15
    },

    headline : {
        paddingLeft: 40,
        paddingTop: 40,
        fontSize: 30,
        fontWeight: 'bold',

    },

    body : {
        paddingLeft: 40,
        paddingRight: 40
    }
})