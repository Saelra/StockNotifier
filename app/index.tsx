import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';

const graphImagePath = '../assets/images/graph-image.jpg';

const Landing: React.FC = () => {

  const router = useRouter();

  const navigateTo = (relativePath: string) => {
    router.push(relativePath as RelativePathString);
  };

  return (
    <ImageBackground source={require(graphImagePath)} style={styles.image}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Stock Notifier</Text>
        <Text style={styles.subheading}>Easily keep track{'\n'}of stock prices</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={() => navigateTo('/dashboard')}>
            <Text style={[styles.buttonText, styles.buttonLeftText]}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonRight]} onPress={() => navigateTo('/about')}>
            <Text style={[styles.buttonText, styles.buttonRightText]}>About Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // To cover the entire ImageBackground.
    backgroundColor: 'rgba(250, 248, 255, 0.66)',
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonLeft: {
    backgroundColor: '#16a34a',
  },
  buttonRight: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
  },
  buttonLeftText: {
    color: '#fff',
  },
  buttonRightText: {
    color: '#000',
  }
});

export default Landing;