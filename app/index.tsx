import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { backgroundFetchTask } from '@/services/stock-fetch';

const BACKGROUND_FETCH_TASK = 'background-fetch';

// Run background fetch task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {

  try {
    const newData = await backgroundFetchTask();

    if (newData) {
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {

    console.error(error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});


const graphImagePath = '../assets/images/graph-image.jpg';

const Landing: React.FC = () => {

  useEffect(() => {

    async function registerBackgroundFetchAsync() {

      return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false, // Android only
        startOnBoot: true, // Android only
      });
    }
    registerBackgroundFetchAsync();

    return () => {};
  }, []);

  const router = useRouter();

  const navigateTo = (relativePath: string) => {
    router.push(relativePath as RelativePathString);
  };

  return (
    <ImageBackground source={require(graphImagePath)} style={styles.image} testID="image-background">
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
    ...StyleSheet.absoluteFillObject, // Fill ImageBackground.
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