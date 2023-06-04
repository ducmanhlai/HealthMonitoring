import React, {useState, useContext, useEffect} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {LineChart} from 'react-native-charts-wrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from '../utils/components/header';
import styles from './style';
import {processColor} from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import COLOR from '../utils/color';
import * as request from '../service/index';
import {get} from '../service/index';
import API from '../utils/api';
import {debounce} from 'lodash';
import {AppContext} from '../../App';
const firebaseConfig = {
  apiKey: 'AIzaSyD8f6u7pcZS96aDABfvlVB06B4PVw5CUQY',
  databaseURL: 'https://fir-authall-37df8-default-rtdb.firebaseio.com',
  authDomain: 'fir-authall-37df8.firebaseapp.com',
  projectId: 'fir-authall-37df8',
  storageBucket: 'fir-authall-37df8.appspot.com',
  appId: '1:836486241957:android:fe35f126178e6b157d374c',
};

firebase.initializeApp(firebaseConfig);

function HomeScreen({navigation}) {
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
  const [check, setCheck] = useState(false);
  const [textNoti, setTextNoti] = useState('');
  // const [spo2, setSpo2] = useState(0);
  // const [bmp, setBMP] = useState(0);
  // const [temp, setTemp] = useState(0);
  const {spo2, setSpo2, bmp, setBMP, temp, setTemp, user} =
    useContext(AppContext);
  useEffect(() => {
    const dbRef = firebase.database().ref('test/led');
    dbRef.on('value', snapshot => {
      const newData = snapshot.val();
      dbRef.set(0);
      setConnect(newData);
      handleSearch(connect);
      // console.log(user.idAccount);
      // (async () => await saveData())().catch(err => console.log(err));
    });

    const dbRef2 = firebase.database().ref('test/spo2');
    dbRef2.on('value', snapshot => {
      const newData = snapshot.val();
      setSpo2(newData);
      setCheck(true);
    });

    const dbRef3 = firebase.database().ref('test/bmp');
    dbRef3.on('value', snapshot => {
      const newData = snapshot.val();
      setBMP(newData);
      setCheck(true);
    });

    const dbRef4 = firebase.database().ref('test/temp');
    dbRef4.on('value', snapshot => {
      const newData = snapshot.val();
      setTemp(newData);
      setCheck(true);
    });

    // Return a cleanup function to remove the listener when the component unmounts
    return () => {
      dbRef.off('value');
      dbRef2.off('value');
      dbRef3.off('value');
      dbRef4.off('value');
    };
  }, [firebase]);

  const handleSearch = debounce(value => {
    // Thực hiện logic tìm kiếm hoặc xử lý dữ liệu tại đây
    console.log('Searching for:', value);
    setConnect(0);
  }, 10000);

  useEffect(() => {
    if (check == true && connect == true) {
      if (bmp > 100 || bmp < 60 || spo2 < 90 || temp < 36.3 || temp > 37.5) {
        sendNotification();
      }
      setCheck(false);
      (async () => await saveData())().catch(err => console.log(err));
    }
  }, [check]);

  const sendNotification = async () => {
    try {
      const currentDate = new Date();

      // Lấy thời gian hiện tại (theo múi giờ UTC)
      const utcTime = currentDate.getTime();

      // Tính toán thời gian theo múi giờ GMT+7 (UTC+7)
      const gmt7Time = utcTime + 7 * 60 * 60 * 1000; // 7 giờ * 60 phút * 60 giây * 1000 milliseconds

      let response = await request.post(API.sendNotification, {
        username: user.email,
        bmp: bmp,
        spo2: spo2,
        temp: temp,
        text: textNoti,
        dateTest: new Date(gmt7Time),
      });

      if (response.data.status == true) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const saveData = async () => {
    console.log('call');
    try {
      const response = await request.postPrivate(
        API.createData,
        {
          id: user.idAccount,
          heartRate: bmp,
          SpO2: spo2,
          temp: temp,
        },
        {headers: {authorization: user.accessToken}},
      );
      if (response.data.status == false) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{left: -120, flexDirection: 'row'}}>
        <View
          style={[
            styles.circle,
            {backgroundColor: connect ? COLOR.green : COLOR.pink},
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
              style={{textAlign: 'center'}}
            />
            <Text style={styles.heartRateText}>{bmp}</Text>
            <Text style={styles.heartRateUnit}>BPM</Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <FontAwesome5 name="temperature-low" style={styles.infoIcon} />
              <Text style={styles.infoText}>{temp.toFixed(1)}°C</Text>
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
  const [dataHeart, setDataHeart] = useState([]);
  const [dataSpO2, setDataSpO2] = useState([]);
  useEffect(() => {
    (async () => {
      const user = JSON.parse(await getUser());
      const tmp = await get(API.getNearest, {
        headers: {
          'Content-Type': 'application/json',
          authorization: user.accessToken,
        },
      });

      // const tmp = await request.get(API.getNearest, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     authorization: user.accessToken,
      //   },
      // });

      setDataHeart(
        tmp.data.map((item, index) => {
          return {
            x: Number(item.hour)||0,
            y: Math.round(item.heartRate)||0,
          };
        }),
      );
      setDataSpO2(
        tmp.data.map((item, index) => {
          return {
            x: Number(item.hour)||0,
            y: Math.round(item.spO2)||0,
          };
        }),
      );
    })().catch(err => console.log(err));
  }, []);
  return (
    <View style={styles.containerChart}>
      <LineChart
        legend={{enabled: true}}
        style={{height: 250}}
        data={{
          dataSets: [
            {
              values: dataHeart,
              label: 'Nhịp tim',
              config: {
                lineWidth: 2,
                drawCircles: false,
                colors: [processColor('blue')],
              },
            },
            {
              values: dataSpO2,
              label: 'SpO2',
              config: {
                lineWidth: 2,
                drawCircles: false,
                colors: [processColor('red')],
                borderColor: 'red',
              },
            },
          ],
          config: {
            xAxis: {
              drawLabels: true,
              drawGridLines: true,
              position: 'BOTTOM',
            },
            yAxis: {
              drawLabels: true,
              drawGridLines: true,
            },
          },
        }}
        descriptionLabel={'Dữ'}
        xAxis={{textColor: '#000000', textSize: 16, position: 'BOTTOM'}}
        yAxis={{left: {textColor: '#000000', textSize: 16}, right: null}}
      />
    </View>
  );
};
async function getUser() {
  return await AsyncStorage.getItem('user');
}
export default HomeScreen;
