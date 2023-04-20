import React, {useState, useContext, useEffect} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LineChart } from 'react-native-charts-wrapper';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from "../utils/components/header";
import styles from './style';


function HomeScreen({navigation}) {
  return (
    <SafeAreaView>
      <Header></Header>
      <View>
        <Moniter/>
        <Chart/>
      </View>
    </SafeAreaView>
  );
}

function Moniter() {
  return (
    <View style={styles.container}>
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>
          <View style={styles.heartRateContainer}>
            <AntDesign
                name="heart"
                color="red"
                size={46}
                style={{textAlign:'center'}}
              />
            <Text style={styles.heartRateText}>70</Text>
            <Text style={styles.heartRateUnit}>BPM</Text>
          </View>

          <View style={styles.line}></View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <FontAwesome5 name="temperature-low" style={styles.infoIcon} />
              <Text style={styles.infoText}>35°C</Text>
            </View>
            <View style={styles.infoItem}>
              <FontAwesome5 name="lungs" style={styles.infoIcon} />
              <Text style={styles.infoText}>50%</Text>
            </View>
          </View>
        </View>
      </View>
      
    </View>
  )
}

function Chart() {
  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.container_chart}>
          <LineChart style={styles.chart}
              data={
                  {
                      dataSets: [
                          {
                              values: fakeData(),
                              label: 'Nhịp tim',
                              config: {
                                  lineWidth: 1.5,
                                  drawCircles: false,
                                  drawCubicIntensity: 0.3,
                                  drawCubic: true,
                                  drawHighlightIndicators: false,
                                  color: "red",
                                  fillColor: "red",
                                  fillAlpha: 90,
                                  valueFormatter: "###",
                              }
                          },

                      ]
                  }
              }
              xAxis={
                  {
                      granularity: 1,
                      granularityEnabled: true,
                      position: 'BOTTOM',
                      valueFormatter: "###",
                  }
              }
              yAxis={
                  {
                      left: {
                          drawGridLines: true
                      },
                  }
              }
              chartDescription={{ text: '' }}
              autoScaleMinMaxEnabled={true}
          />
      </View>
    </View>
  )
}

function fakeData() {
  let list = []
  for (let index = 1; index < 8; index++) {
      list.push({ x: index, y: Math.floor(Math.random() * 55) + 65 })
  }
  return list;
}

export default HomeScreen;
