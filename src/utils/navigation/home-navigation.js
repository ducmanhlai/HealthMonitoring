import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../auth/login';
import RegisterScreen from '../../auth/register';
import ForgotPasswordScreen from '../../auth/forgot-password';
import ProfileRegisterScreen from '../../auth/profileRegister';
import HomeTab from './home-tab';

const Stack = createStackNavigator();
function HomeNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="HomeScreen" component={HomeTab} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="ProfileRegisterScreen"
        component={ProfileRegisterScreen}
      />
    </Stack.Navigator>
  );
}

export default HomeNavigation;
