import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import COLOR from "../../utils/color";
function Item(props) {
    return (<TouchableOpacity style={{marginBottom:10}}>
        <Text style={{backgroundColor:COLOR.gray,borderRadius:5}}>Ngày 17/04/2023</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='heartbeat' size={30} color="red"></Icon>
                    <Text style={{ fontSize: 18,lineHeight:30 }}>: 65BMP</Text>
            </View>
            <View style={{ flexDirection: 'row',paddingTop:10}}>
                <View style={{ flexDirection: 'row', alignItems:'flex-start'}}>
                    <Text style={{ fontSize: 25, lineHeight: 30, color: 'red' }}>O</Text>
                    <Text style={{ fontSize: 11, lineHeight: 45, color: 'red' }}>2</Text>
                    <Text style={{ fontSize: 20, lineHeight: 30 }}>:</Text>
                    <Text style={{ fontSize: 18, lineHeight: 30 }}>89% SpO</Text>
                    <Text style={{ fontSize: 11, lineHeight: 45, color: 'red' }}>2</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>)
}
export default Item