import React from "react";
import {
    StyleSheet,
    Text,
    View, processColor,FlatList, SafeAreaView,TouchableOpacity
} from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import Header from "../utils/components/header";
import Item from "./components/Item";
const COLOR_RED = processColor('#FF0000');
function History() {
    return <View style={{ height: '100%', flex: 1, flexDirection: 'column' }}>
        <Header></Header>
        <Chart />
       <ListHistory/>
    </View>
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
                                        color: COLOR_RED,
                                        fillColor: COLOR_RED,
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
                <Text style={{ marginLeft: 20, color: 'black' }}>Dữ liệu từ 01/02-07/02</Text>
            </View>
        </View>
    );
}
function ListHistory() {
    return  <SafeAreaView style={{ width: '100%', flex: 3,justifyContent:"center",alignItems:"center",alignSelf:'center',backgroundColor:'#F5FCFF'}}>
    <FlatList
        data={[1, 2, 3, 4, 5, 6, 8, 8, 5, 3, 3, 4, 4, 4, 34, 3, 43]}
        style={{ height: '100%', width: '80%',backgroundColor:'#F5FCFF' }}
        contentContainerStyle={{ flexGrow: 10 }}
        scrollEnabled={true}
        renderItem={(item) =>Item(item)}>
    </FlatList>
</SafeAreaView>
}

const styles = StyleSheet.create({
    container_chart: {
        height: 250,
        backgroundColor: '#F5FCFF'
    },
    chart: {
        height: 200,
    }
});
function getData() {
    let list = []
    for (let index = 1; index < 8; index++) {
        list.push({ x: index, y: Math.floor(Math.random() * 55) + 65 })
    }
    return list;
}
export default History;