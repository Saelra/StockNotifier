import React from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";



const About: React.FC = () => {
    const router = useRouter();

   

    return (
        <View>
            <Pressable onPress={() => router.push("/dashboard")} testID="backButton">
                <Ionicons style={styles.backButton} name="arrow-back" size={30} color={"black"}/>
            </Pressable>
            <Text style={styles.headline}>About Us</Text>
            <Text style={styles.body} testID="aboutInfo">
            This dream team was created to excel in college and deepen our understanding of computing systems. With this project we will strive to learn the finer details of software Architecture and the exciting world of mobile projects. 
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