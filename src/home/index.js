import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, Text, View, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LineChart } from 'react-native-charts-wrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from '../utils/components/header';
import styles from './style';
import { MenuProvider } from 'react-native-popup-menu';
import { processColor } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import COLOR from '../utils/color';
import { get } from '../service';
import API from '../utils/api';
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

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView>
      <Header navigation={navigation} />
      <View>
        <Moniter />
        <Chart />
      </View>
    </SafeAreaView>
  );
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
    dbRef2.on('value', snapshot => {
      const newData = snapshot.val();
      setSpo2(newData);
    });

    const dbRef3 = firebase.database().ref('test/bmp');
    dbRef3.on('value', snapshot => {
      const newData = snapshot.val();
      setBMP(newData);
    });

    const dbRef4 = firebase.database().ref('test/temp');
    dbRef4.on('value', snapshot => {
      const newData = snapshot.val();
      setTemp(newData);
    });

    // Return a cleanup function to remove the listener when the component unmounts
    return () => {
      dbRef.off('value');
      dbRef2.off('value');
      dbRef3.off('value');
      dbRef4.off('value');
    };
  }, [firebase]);

  return (
    <View style={styles.container}>
      <View style={{ left: -120, flexDirection: 'row' }}>
        <View
          style={[
            styles.circle,
            { backgroundColor: connect ? COLOR.green : COLOR.pink },
          ]}></View>
        <Text style={styles.statusText}>
          {connect ? 'Kết nối' : 'Mất kết nối'}
        </Text>
      </View>
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>
          <View style={styles.heartRateContainer}>
            <AntDesign
              name="heart"
              color="red"
              size={18}
              style={{ textAlign: 'center' }}
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
const Chart = () => {
  const [dataHeart, setDataHeart] = useState([])
  const [dataSpO2, setDataSpO2] = useState([])
  useEffect(() => {
    (async () => {
      const user = JSON.parse(await getUser())
      const tmp = await get(API.getNearest, {
        headers: {
          'Content-Type': 'application/json',
          authorization: user.accessToken,
        },
      });

      setDataHeart(tmp.data.map((item, index) => {
        return {
          x: Number(item.hour),
          y: Math.round(item.heartRate),
        };
      }))
      setDataSpO2(tmp.data.map((item, index) => {
        return {
          x: Number(item.hour),
          y: Math.round(item.spO2),
        };
      }))
    })().catch(err => console.log(err))
  }, [])
  return (
    <View style={styles.containerChart}>
      <LineChart
        legend={{ enabled: true }}
        
        style={{height:250}}
        data={{
          dataSets: [
            {
              values: dataHeart,
              label: 'Nhịp tim',
              config: {
                lineWidth: 2,
                drawCircles: false,
                color: [processColor('blue')],
        
              },
            },
            {
              values: dataSpO2,
              label: 'SpO2',
              config: {
                lineWidth: 2,
                drawCircles: false,
                colors: [ processColor('red')],
                borderColor: 'red'
              },
            }
          ],
          config: {
            xAxis: {
              drawLabels: true,
              drawGridLines: true,
              position: 'BOTTOM',
              // ...
            },
            yAxis: {
              drawLabels: true,
              drawGridLines: true,
           
            },
          },
        }}
        xAxis={{ textColor: '#000000', textSize: 16,position: 'BOTTOM'}}
        yAxis={{ left: { textColor: '#000000', textSize: 16 }, right: null }}
      />
    </View>
  );
};
async function getUser() {
  return await AsyncStorage.getItem('user');
}
export default HomeScreen;
