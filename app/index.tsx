import {   View, Text, Pressable } from "react-native";
import React from "react";
import { Link } from 'expo-router';

const Landing = () => {
  return (
   <>
   <Text>Hello World!</Text>
   <Link href={"/dashboard"}>to the Dashboard</Link>
   </>
     
    
  );
}

export default Landing;
