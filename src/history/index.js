import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  processColor,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import {get} from '../service';
import API from '../utils/api';
import Header from '../utils/components/header';
import Item from './components/Item';

const COLOR_RED = processColor('#FF0000');
function History({navigation}) {
  const [user, setUser] = useState({});
  const [listHistory, setListHistory] = useState([]);
  async function getHistory(accessToken) {
    const tmp = await get(API.getHistory, {
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
    });
    setListHistory(
      tmp.data.heart.map((item, index) => {
        return {
          x: new Date(item.date).getDate(),
          y: item.heartRate,
          oxy: tmp.data.spO2[index].oxygen,
          date: new Date(item.date).toLocaleDateString(),
        };
      }),
    );
  }
  useEffect(() => {
    getUser()
      .then(data => {
        setUser(JSON.parse(data));
        getHistory(JSON.parse(data).accessToken).catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <View style={{height: '100%', flex: 1, flexDirection: 'column'}}>
      <Header navigation={navigation} />
      <Chart />
      <ListHistory />
    </View>
  );
  function Chart() {
    return (
      <View style={{marginTop: 10}}>
        <View style={styles.container_chart}>
          <LineChart
            style={styles.chart}
            data={{
              dataSets: [
                {
                  values: listHistory,
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
                    valueFormatter: '###',
                  },
                },
              ],
            }}
            xAxis={{
              granularity: 1,
              granularityEnabled: true,
              position: 'BOTTOM',
              valueFormatter: '###',
            }}
            yAxis={{
              left: {
                drawGridLines: true,
              },
            }}
            chartDescription={{text: ''}}
            autoScaleMinMaxEnabled={true}
          />
          <Text style={{marginLeft: 20, color: 'black'}}>
            Dữ liệu từ 01/02-07/02
          </Text>
        </View>
      </View>
    );
  }
  function ListHistory() {
    return (
      <SafeAreaView
        style={{
          width: '100%',
          flex: 3,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#F5FCFF',
        }}>
        <FlatList
          data={listHistory}
          style={{height: '100%', width: '80%', backgroundColor: '#F5FCFF'}}
          contentContainerStyle={{flexGrow: 10}}
          scrollEnabled={true}
          renderItem={item => Item(item)}></FlatList>
      </SafeAreaView>
    );
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
});
function fakeData() {
  let list = [];
  for (let index = 1; index < 8; index++) {
    list.push({x: index, y: Math.floor(Math.random() * 55) + 65});
  }
  return list;
}
export default History;
