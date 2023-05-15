import React, {useState, useContext, useEffect} from 'react';
import {SafeAreaView, Text, View, Dimensions} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import {LineChart} from 'react-native-charts-wrapper';
import {LineChart} from 'react-native-chart-kit';


import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from '../utils/components/header';
import styles from './style';
import {MenuProvider} from 'react-native-popup-menu';

import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import COLOR from '../utils/color';

const firebaseConfig = {
  apiKey: 'AIzaSyD8f6u7pcZS96aDABfvlVB06B4PVw5CUQY',
  databaseURL: 'https://fir-authall-37df8-default-rtdb.firebaseio.com',
  authDomain: 'fir-authall-37df8.firebaseapp.com',
  projectId: 'fir-authall-37df8',
  storageBucket: 'fir-authall-37df8.appspot.com',
  // messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: '1:836486241957:android:fe35f126178e6b157d374c',
};

firebase.initializeApp(firebaseConfig);

function HomeScreen({navigation}) {
  return (
    <SafeAreaView>
      <Header navigation={navigation} />
      <View>
        <Status/>
        <Moniter />
        <Chart />
      </View>
    </SafeAreaView>
  );
}

function Status(){
  var status = false;
  var statusColor = COLOR.red;
  if(status) statusColor=COLOR.green; else statusColor=COLOR.red;
  return(
    <View style={styles.statusContainer}>
      <View style={[styles.circle,{backgroundColor:statusColor}]}></View>
      <Text style={styles.statusText}>{status? 'Kết nối' : 'Mất kết nối'}</Text>
    </View>
  )
}

function Moniter() {
  const [connect, setConnect] = useState(0);
  const [spo2, setSpo2] = useState(0);
  const [bmp, setBMP] = useState(0);
  const [temp, setTemp] = useState(0);
  useEffect(() => {
    const dbRef = firebase.database().ref('test/led');
    dbRef.on('value', snapshot => {
      const newData = snapshot.val();
      setConnect(newData);
    });

    const dbRef2 = firebase.database().ref('test/spo2');
    dbRef.on('value', snapshot => {
      const newData = snapshot.val();
      setSpo2(newData);
    });

    const dbRef3 = firebase.database().ref('test/bmp');
    dbRef.on('value', snapshot => {
      const newData = snapshot.val();
      setBMP(newData);
    });

    const dbRef4 = firebase.database().ref('test/temp');
    dbRef.on('value', snapshot => {
      const newData = snapshot.val();
      setTemp(newData);
    });

    // Return a cleanup function to remove the listener when the component unmounts
    return () => {
      dbRef.off('value');
    };
  }, [firebase]);
  return (
    <View style={styles.container}>
      <Text>{connect}</Text>
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>
          <View style={styles.heartRateContainer}>
            <AntDesign
              name="heart"
              color="red"
              size={18}
              style={{textAlign: 'center'}}
            />
            <Text style={styles.heartRateText}>{bmp}</Text>
            <Text style={styles.heartRateUnit}>BPM</Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <FontAwesome5 name="temperature-low" style={styles.infoIcon} />
              <Text style={styles.infoText}>{temp}°C</Text>
            </View>
            <View style={styles.infoItem}>
              <FontAwesome5 name="lungs" style={styles.infoIcon} />
              <Text style={styles.infoText}>{spo2}%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const data = {
  labels:['12h', '11h', '10h', '9h', '8h', '7h', '6h', '5h', '4h', '3h', '2h', '1h trước'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Set the color of the line
      strokeWidth: 2 // Set the width of the line
    }
  ]
};

const chartConfig = {
  backgroundColor: COLOR.white,
  backgroundGradientFrom: COLOR.white,
  backgroundGradientTo: COLOR.white,
  decimalPlaces: 2, // Number of decimal places to round the labels to
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Set the color of the labels
  style: {
    borderRadius: 16,
    
  }
};

const Chart = () => {
  return (
    <View style={styles.containerChart}>
      <LineChart
        data={data}
        width={Dimensions.get('window').width} // Set the width of the chart
        height={220} // Set the height of the chart
        chartConfig={chartConfig}
        bezier // Enable bezier curve
      />
    </View>
  );
};

export default HomeScreen;
