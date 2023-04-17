import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import COLOR from "../color";
function Header(props) {
   return (<View style={style.container}>
      <Image source={{ uri: 'https://123design.org/wp-content/uploads/2020/07/AOTHOITRANGLM0235-qoobee-l%C3%A8-l%C6%B0%E1%BB%A1i-cute.jpg' }}
         style={style.avatar}
      ></Image>
      <Text style={style.name}>Chỗ này để tên</Text>
   </View>)
}
export default Header;
const style = StyleSheet.create({
   container:{
    backgroundColor:COLOR.sencondary,
    flexDirection: 'row',
    height:100,
    alignItems:"center"
   },
   avatar: {
      height: 70, 
      width: 70,
      borderRadius:40,
      marginHorizontal:18
   },
   name:{
     color: 'black',
     fontWeight:'700',
     fontSize:18
   }
})