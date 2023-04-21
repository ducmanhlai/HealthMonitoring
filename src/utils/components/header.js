import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import COLOR from "../color";
function Header(props) {
   const [user,setUser]= useState({});
   useEffect(() => { 
     AsyncStorage.getItem('user').then(data=>{
      setUser(JSON.parse(data));
     }).catch(err=>console.log(err))
   }, [])
   return (<View style={style.container}>
      <Image source={{ uri:user.imageUrl }}
         style={style.avatar}
      ></Image>
      <Text style={style.name}>{user.name}</Text>
   </View>)
}
export default Header;
const style = StyleSheet.create({
   container: {
      backgroundColor: COLOR.sencondary,
      flexDirection: 'row',
      height: 100,
      alignItems: "center"
   },
   avatar: {
      height: 70,
      width: 70,
      borderRadius: 40,
      marginHorizontal: 18
   },
   name: {
      color: 'black',
      fontWeight: '700',
      fontSize: 18
   }
})