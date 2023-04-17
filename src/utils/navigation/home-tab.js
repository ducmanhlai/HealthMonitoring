import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from '../../home';
import CheckHealthScreen from '../../home/check-health';
import History from '../../history';
import COLOR from '../color';

const Tab = createBottomTabNavigator();

function HomeTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={COLOR.pink}
      inactiveColor={COLOR.white}
      activeBackgroundColor={COLOR.sencondary}
      inactiveBackgroundColor={COLOR.sencondary}
      style={{backgroundColor: COLOR.sencondary}}
      screenOptions={{
        tabBarActiveTintColor: COLOR.pink,
        headerShown: false,
        style: {
          backgroundColor: COLOR.sencondary,
        },
      }}>
      <Tab.Screen
        name="CheckHealthScreen"
        component={CheckHealthScreen}
        options={{
          tabBarLabel: 'Kiểm tra',
          tabBarIcon: ({color, size}) => (
            <AntDesign name="medicinebox" color={COLOR.pink} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({color, size}) => (
            <AntDesign name="heart" color={COLOR.gray} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: 'Lịch sử',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="history" color={COLOR.gray} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeTab;
