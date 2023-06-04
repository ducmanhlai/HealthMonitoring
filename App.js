import {NavigationContainer} from '@react-navigation/native';
import React, {createContext, useState, useEffect} from 'react';
import HomeNavigation from './src/utils/navigation/home-navigation';
import {MenuProvider} from 'react-native-popup-menu';
const AppContext = createContext();

const AppContextProvider = ({children}) => {
  const [user, setUser] = useState('');
  const [isLogin, setIsLogin] = useState('');
  const [spo2, setSpo2] = useState(0);
  const [bmp, setBMP] = useState(0);
  const [temp, setTemp] = useState(0);
  const contextValues = {
    user,
    setUser,
    isLogin,
    setIsLogin,
    spo2,
    setSpo2,
    bmp,
    setBMP,
    temp,
    setTemp,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
export {AppContext, AppContextProvider};

export default function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <MenuProvider>
          <HomeNavigation />
        </MenuProvider>
      </NavigationContainer>
    </AppContextProvider>
  );
}
