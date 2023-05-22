import React from "react";
import { Text, TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
function Item(props) {
    const data = props.item
    return (
        <TouchableOpacity style={{ marginBottom: 10, backgroundColor:'#77e0ff26',borderRadius:20,padding:5}}>
        <Text style={{color:'black',fontWeight:'700'}}>Ngày {data.date}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='heartbeat' size={30} color="red"></Icon>
                <Text style={{ fontSize: 18, lineHeight: 30,color:'black' }}>: {data.y}BMP</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 25, lineHeight: 30, color: 'red' }}>O</Text>
                    <Text style={{ fontSize: 11, lineHeight: 45, color: 'red' }}>2</Text>
                    <Text style={{ fontSize: 20, lineHeight: 30 }}>:</Text>
                    <Text style={{ fontSize: 18, lineHeight: 30,color:'black' }}>{data.oxy}% SpO</Text>
                    <Text style={{ fontSize: 11, lineHeight: 45, color: 'red' }}>2</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
    )
}
export default Item
