import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  StatusBar,
} from 'react-native';

import {
  Header,
  Colors
} from 'react-native/Libraries/NewAppScreen';

import BackgroundFetch from "react-native-background-fetch";

import { fetchStockAggregate } from '../services/stock-api';
import { setStockData, getStockData } from '../services/stock-storage';
import { IAggs } from '@polygon.io/client-js';

interface Props {
  stockSymbol: string;
  timeSpan: string;
  incrementAmount: number;
  incrementMultiplier: number;
  events: {
    taskId: string;
    timestamp: string;
  }[];
}

interface State {
  events: {
    taskId: string;
    timestamp: string;
  }[];
  stockData: {};
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      events: [],
      stockData: {}
    };
  }

  componentDidMount() {
    // Initialize BackgroundFetch ONLY ONCE when component mounts.
    this.initBackgroundFetch();
  }

  async initBackgroundFetch() {
    // BackgroundFetch event handler.
    const onEvent = async (taskId: string) => {
      console.log('[BackgroundFetch] task: ', taskId);
      // Do your background work...

      // Access the props.
      const { stockSymbol, timeSpan, incrementAmount, incrementMultiplier } = this.props;
      let { stockData } = this.state;

      // Update the stock data.
      stockData = fetchStockAggregate(stockSymbol, timeSpan, incrementAmount, incrementMultiplier);
      this.setState({ stockData });
      setStockData(stockData as JSON);

      await this.addEvent(taskId);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async (taskId: string) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

    console.log('[BackgroundFetch] configure status: ', status);
  }

  // Add a BackgroundFetch event to <FlatList>
  addEvent(taskId: string): Promise<void> {
    // Simulate a possibly long-running asynchronous task with a Promise.
    return new Promise((resolve, reject) => {
      this.setState(state => ({
        events: [...state.events, {
          taskId: taskId,
          timestamp: (new Date()).toString()
        }]
      }));
      resolve();
    });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />

            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>BackgroundFetch Demo</Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.sectionContainer}>
            <FlatList
              data={this.state.events}
              renderItem={({item}) => (<Text>[{item.taskId}]: {item.timestamp}</Text>)}
              keyExtractor={item => item.timestamp}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});

export default App;