import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {useEffect, useContext, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import COLOR from '../color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {AppContext} from '../../../App';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import styles from '../../auth/style';
function Header({navigation}) {
  const {setIsLogin, user, setUser} = useContext(AppContext);
  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(data => {
        if (data != null) {
          setIsLogin(true);
          setUser(JSON.parse(data));
        }
      })
      .catch(err => console.log(err));
  }, []);
  function logout() {
    setIsLogin(false);
    //delete old user
    AsyncStorage.removeItem('user')
      .then(() => {
        console.log('user removed from AsyncStorage');
      })
      .catch(error => {
        console.error(error);
      });
    setUser(null);
    navigation.replace('LoginScreen');
  }
  return (
    <View style={style.container}>
      <View style={style.view_avatar}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProfileScreen');
          }}>
          <Image
            source={{
              uri: !user?.imageUrl
                ? 'https://assets-prd.ignimgs.com/2022/08/01/cameron-crovetti-1659376185203.jpg'
                : user.imageUrl,
            }}
            style={style.avatar}
          />
        </TouchableOpacity>
        <Text style={style.name}>
          {user?.name?.length > 16
            ? `${user?.name.substring(0, 16)}...`
            : user?.name}
        </Text>
      </View>
      {/* <TouchableOpacity
        onPress={() => {
          setIsLogin(false);
          //delete old user
          AsyncStorage.removeItem('user')
            .then(() => {
              console.log('user removed from AsyncStorage');
            })
            .catch(error => {
              console.error(error);
            });
          setUser(null);
          navigation.replace('LoginScreen');
        }}> */}
      <View>
        <Menu>
          <MenuTrigger>
            <Feather style={style.icon_more} name="more-vertical" size={30} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => navigation.navigate('ProfileScreen')}>
              <View style={style.view_avatar}>
                <AntDesign style={style.icon_logout} name="edit" size={30} />
                <Text style={style.txt_menu}>Đổi thông tin</Text>
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => navigation.navigate('ChangePasswordScreen')}>
              <View style={style.view_avatar}>
                <AntDesign style={style.icon_logout} name="lock" size={30} />
                <Text style={style.txt_menu}>Đổi mật khẩu</Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={() => logout()}>
              <View style={style.view_avatar}>
                <AntDesign style={style.icon_logout} name="logout" size={30} />
                <Text style={style.txt_menu}>Đăng xuất</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
      {/* </TouchableOpacity> */}
    </View>
  );
}
export default Header;
const style = StyleSheet.create({
  container: {
    backgroundColor: COLOR.sencondary,
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 40,
    marginHorizontal: 18,
  },
  name: {
    color: 'black',
    fontWeight: '700',
    fontSize: 18,
  },
  view_avatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon_logout: {
    color: COLOR.sencondary,
    marginRight: 20,
  },
  icon_more: {
    color: COLOR.white,
    marginRight: 20,
  },
  txt_menu: {
    color: COLOR.sencondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
