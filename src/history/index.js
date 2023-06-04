import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  processColor,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator, Animated
} from 'react-native';
import { Layout } from 'react-native-reanimated';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker from 'react-native-date-picker';
import { LineChart,CombinedChart } from 'react-native-charts-wrapper';
import SwitchSelector from 'react-native-switch-selector';
import { Dimensions } from 'react-native';
import { get } from '../service';
import API from '../utils/api';
import Header from '../utils/components/header';
import Item from './components/Item';
import COLOR from '../utils/color';
import ItemPredict from './components/ItemPredict';

const COLOR_RED = processColor('#FF0000');
function History({ navigation }) {
  const [history, setHistory] = useState(true);
  const handleButtonClick = value => {
    setHistory(value);
  };
  const [load, setLoad] = useState(true);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const currentDate = new Date();
  const lastDate = new Date();
  lastDate.setDate(currentDate.getDate() + 14)
  const [dateFrom, setDateFrom] = useState(new Date(2023,4,23));
  const [dateTo, setDateTo] = useState(lastDate);
  const [listHistory, setListHistory] = useState([]);
  const [listPredict, setListPredict] = useState([]);
  async function getHistory(accessToken) {
    const tmp = await get(API.getHistory, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    setListHistory(
      tmp.data.map((item, index) => {
        return {
          x: new Date(item.date).getDate(),
          y: item.heartRate,
          oxy: item.SpO2,
          date: new Date(item.date).toLocaleDateString(),
        };
      }),
    );
  }
  async function getHistoryPredict(accessToken) {
    const tmp = await get(API.getHistoryPredict, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    setListPredict(
      tmp.data.map((item, index) => {
        return {
          x: new Date(item.createdAt).getDate(),
          y: item.heartBeat,
          oxy: item.oxygen,
          temp: item.temp,
          isHealthy: item.isHealthy,
          date: new Date(item.createdAt).toLocaleDateString(),
        };
      }),
    );
  }
  useEffect(() => {
    getUser()
      .then(data => {
        Promise.all([getHistory(JSON.parse(data).accessToken), getHistoryPredict((JSON.parse(data).accessToken))]).finally(() => {
          setTimeout(() => {
            setLoad(false)
          }, 2500)
        })
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <View style={{ height: '100%', flex: 1, flexDirection: 'column' }}>
      <Header navigation={navigation} />
      <View style={{ paddingHorizontal: 40 }}>
        <SwitchSelector
          initial={0}
          onPress={value => handleButtonClick(value)}
          textColor={COLOR.black}
          selectedColor={COLOR.black}
          buttonColor={COLOR.primary}
          borderColor={COLOR.primary}
          hasPadding
          options={[
            { label: 'Lịch sử đo nhịp tim', value: true },
            { label: 'Lịch sử kiểm tra sức khỏe', value: false },
          ]}
          testID="gender-switch-selector"
          accessibilityLabel="gender-switch-selector"
        />
      </View>
      {history ? (
        load ? <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View> :
          <View style={{ height: '100%', flex: 1, flexDirection: 'column' }}>
            <Chart />
            <ListHistory />
          </View>
      ) : (
        <View
          style={{
            height: '100%',
            flex: 1,
            flexDirection: 'column',
          }}>
          <ListPredictHistory />
        </View>
      )
      }
    </View >
  );
  function joinByDate() {
    const result = {};
    var resultList = [];
    listHistory.forEach(item => {
      const { date, ...rest } = item;
      if (!result[date]) {
        result[date] = [rest];
      } else {
        result[date].push(rest);
      }
      resultList = Object.entries(result).map(([date, groupedObjects]) => {
        return { date, values: groupedObjects };
      });
    });

    const total = resultList.map(element => {
      const len = element.values.length;
      const newElement = {
        date: element.date,
        values: element.values.reduce(
          (acc, cur) => {
            acc.oxy += cur.oxy;
            acc.x += cur.x;
            acc.y += cur.y;
            return acc;
          },
          { oxy: 0, x: 0, y: 0 },
        ),
      };

      return {
        date: newElement.date,
        oxy: Math.trunc(newElement.values.oxy / len),
        x: new Date( newElement.date.split('/')[2],newElement.date.split('/')[1]-1,newElement.date.split('/')[0]).getTime(),
        y: Math.trunc(newElement.values.y / len),
        isShow:
          compareDates(newElement.date, dateFrom, dateTo,)
      };
    });
    return total;
  }
  function Chart() {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    useEffect(() => {
      Animated.stagger(50, [
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),

      ]).start();
    }, []);
    return (
      <View style={[{ marginTop: 10 },]}>
        <Animated.View style={[styles.container_chart, {
          opacity,
          transform: [{ translateY }],
        }]}>
          <LineChart
            style={styles.chart}
            data={{
              dataSets: [
                {
                  values: joinByDate().filter(item => {
                    return item.isShow;
                  }),
                  label: 'Nhịp tim',
                  config: {
                    lineWidth: 1.5,
                    drawCircles: false,
                    drawCubicIntensity: 0.3,
                    drawCubic: true,
                    drawHighlightIndicators: false,
                    color: COLOR_RED,
                    fillColor: COLOR_RED,
                    fillAlpha: 90,
                    granularity: 1,
                    granularityEnabled: true,
                    valueFormatter: "###",
                    scaleEnabled:true
                  },
                },
              ],
            }}
            xAxis={{
              enabled: true,
              fontWeight:"bold",
              textColor: processColor('black'),
              fontStyle:"italic",
              fontSize: 12,
              drawGridLines: true,
              drawAxisLine: true,
              position:'BOTTOM',
              granularityEnabled: false,
              centerAxisLabels: true,
              axisLineColor: processColor('white'),
              axisLineWidth: 1,
              valueFormatter: 'date',
              valueFormatterPattern: 'dd MMM'
            }}
            chartDescription={{ text: '' }}
            autoScaleMinMaxEnabled={true}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text style={{ marginLeft: 20, marginTop: 13, color: 'black' }}>
              Dữ liệu từ
            </Text>
            <TouchableOpacity onPress={() => setOpenFrom(true)}>
              <View>
                <TextInput
                  value={moment(dateFrom).format('DD/MM/YYYY')} // Display selected date in TextInput
                  style={{ color: 'black' }}
                  editable={false} // Disable editing of TextInput
                />
                <Entypo name="calendar" size={30} color={COLOR.sencondary} />
              </View>
            </TouchableOpacity>
            <DatePicker
              modal
              open={openFrom}
              date={dateFrom}
              mode="date"
              onConfirm={date => {
                setOpenFrom(false);
                setDateFrom(date);
              }}
              onCancel={() => {
                setOpenFrom(false);
              }}
            />
            <Text style={{ marginLeft: 20, marginTop: 13, color: 'black' }}>
              Đến
            </Text>
            <TouchableOpacity onPress={() => setOpenTo(true)}>
              <View>
                <TextInput
                  value={moment(dateTo).format('DD/MM/YYYY')} // Display selected date in TextInput
                  style={{ color: 'black' }}
                  editable={false} // Disable editing of TextInput
                />
                <Entypo name="calendar" size={30} color={COLOR.sencondary} />
              </View>
            </TouchableOpacity>
            <DatePicker
              modal
              open={openTo}
              date={dateTo}
              mode="date"
              onConfirm={date => {
                setOpenTo(false);
                setDateTo(date);
              }}
              onCancel={() => {
                setOpenTo(false);
              }}
            />
          </View>
        </Animated.View>
      </View>
    );
  }

  function ListHistory() {
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    const rotateX = useRef(new Animated.Value(90)).current;
    useEffect(() => {
      Animated.stagger(50, [
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(rotateX, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);
    return (
      <View
        style={{
          width: '100%',
          flex: 3,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#F5FCFF',
        }}>
        <AnimatedFlatList
          data={joinByDate().filter(item => {
            return item.isShow;
          })}
          style={{ height: '100%', width: '95%', backgroundColor: '#F5FCFF' }}
          contentContainerStyle={{ flexGrow: 10 }}
          scrollEnabled={true}
          renderItem={(item, index) => (
            <Animated.View
              style={{
                opacity,
                transform: [{ translateY }, {
                  rotateX: rotateX.interpolate({
                    inputRange: [0, 90],
                    outputRange: ['0deg', '90deg'],
                  })
                }],
              }}
            >{Item(item)}</Animated.View>
          )}
        ></AnimatedFlatList>
      </View>
    )
  }

  function ListPredictHistory() {
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    const rotateX = useRef(new Animated.Value(90)).current;
    useEffect(() => {
      Animated.stagger(50, [
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(rotateX, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);
    return <View>
      <AnimatedFlatList
        data={listPredict}
        style={{ height: '100%', width: '95%', backgroundColor: '#F5FCFF' }}
        contentContainerStyle={{ flexGrow: 10 }}
        scrollEnabled={true}
        renderItem={(item, index) => (
          <Animated.View
            style={{
              opacity,
              transform: [{ translateY }, {
                rotateX: rotateX.interpolate({
                  inputRange: [0, 90],
                  outputRange: ['0deg', '90deg'],
                })
              }],
            }}
          >{ItemPredict(item)}</Animated.View>
        )}

      ></AnimatedFlatList>
    </View>
  }
}

async function getUser() {
  return await AsyncStorage.getItem('user');
}

const styles = StyleSheet.create({
  container_chart: {
    height: 250,
    backgroundColor: '#F5FCFF',
  },
  chart: {
    height: 200,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10
  }
});
const compareDates = (d1, d2, d3) => {
  let tmp = d1.split('/');
  let date1 = new Date(tmp[2], tmp[1] - 1, tmp[0], 23, 59);
  date1 = date1.getTime();
  let date2 = new Date(d2).getTime();
  let date3 = new Date(d3);
  date3.setDate(d3.getDate()+1)
  date3= date3.getTime();
  return (date1 >= date2 && date1 <date3) ? true : false
};

export default History;
