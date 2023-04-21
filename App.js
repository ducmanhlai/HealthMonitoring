import {NavigationContainer} from '@react-navigation/native';
import React, {createContext, useState, useEffect} from 'react';
import HomeNavigation from './src/utils/navigation/home-navigation';
import {MenuProvider} from 'react-native-popup-menu';

const AppContext = createContext();

const AppContextProvider = ({children}) => {
  const [user, setUser] = useState('');
  const [isLogin, setIsLogin] = useState('');
  const contextValues = {
    user,
    setUser,
    isLogin,
    setIsLogin,
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
