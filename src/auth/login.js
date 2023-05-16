import React, {useState, useContext, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
} from 'react-native';
import styles from './style';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as request from '../service';
import API from '../utils/api';
import {AppContext} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({navigation}) {
  const {setIsLogin, setUser} = useContext(AppContext);
  const [seePassword, setSeepassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const checkData = () => {
    if (email.trim().length == 0) {
      ToastAndroid.show('Không được để trống email!', ToastAndroid.SHORT);
      return false;
    }
    if (password.trim().length == 0) {
      ToastAndroid.show('Không được để trống password!', ToastAndroid.SHORT);
      return false;
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) !== true) {
      ToastAndroid.show('Email không hợp lệ!', ToastAndroid.SHORT);
      return false;
    }
    return true;
  };
  const login = async (userinfor = {}) => {
    if (checkData() == true) {
      try {
        let response;
        if (userinfor?.username === undefined) {
          response = await request.post(API.login, {
            username: email,
            password: password,
          });
        } else {
          const uname = userinfor?.username;
          response = await request.post(API.login, {
            username: uname,
            type: 'gmail',
          });
        }

        if (response.data.status == true) {
          // setEmail('');
          // setPassword('');
          const account = response.data.data.user;

          const user = {
            email: account.email,
            id: account.userInfo['_id'],
            name: account.userInfo.name,
            imageUrl: account.userInfo.imageUrl,
            idInfo:account.userInfo,
            gender: account.userInfo.gender,
            birthDay: account.userInfo.birthDay,
            phoneNumber: account.userInfo.phoneNumber,
            familyPhoneNumber: account.userInfo.familyPhoneNumber,
            height: account.userInfo.height,
            weight: account.userInfo.weight,
            accessToken: response.headers.authorization,
            refreshToken: response.data.data.refreshToken,
          };

          setIsLogin(true);
          setUser(user);
          AsyncStorage.setItem('user', JSON.stringify(user))
            .then(() => console.log('Object stored successfully'))
            .catch(error => console.log('Error storing object: ', error));

          navigation.replace('HomeScreen');

          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        }
      } catch (error) {
        console.log(error);
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(data => {
        if (data != null) navigation.replace('HomeScreen');
        else setIsLoading(true);
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <SafeAreaView>
      {isLoading ? (
        <View>
          <View style={styles.header}>
            <Text style={styles.title1}>Chào mừng bạn</Text>
            <Text style={styles.title2}>ĐĂNG NHẬP</Text>
            <View style={styles.headerBar}>
              <View style={styles.barHead1} />
              <View style={styles.barHead2} />
            </View>
          </View>
          <View style={styles.viewInput}>
            <View style={styles.viewIconInput}>
              <Fontisto style={styles.iconInput} name="email" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={newText => setEmail(newText)}
              />
            </View>
            <View style={styles.lineInput} />
            <View style={styles.viewIconInput}>
              <FontAwesome5
                style={styles.iconInput}
                name="unlock-alt"
                size={20}
              />
              <TextInput
                style={styles.input}
                secureTextEntry={!seePassword}
                placeholder="Mật khẩu"
                onChangeText={newText => setPassword(newText)}
              />

              <TouchableOpacity onPress={() => setSeepassword(!seePassword)}>
                {seePassword ? (
                  <FontAwesome style={styles.iconInput} name="eye" size={20} />
                ) : (
                  <FontAwesome
                    style={styles.iconInput}
                    name="eye-slash"
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.lineInput} />
          </View>
          <View style={styles.viewBtnLogin}>
            <TouchableOpacity onPress={() => login()}>
              <View style={styles.btnLogin}>
                <Text style={styles.txtLogin}>Đăng nhập</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.viewTxtOther}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProfileRegisterScreen')}>
                <Text style={styles.txtOther}>Đăng ký</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                <Text style={styles.txtOther}>Quên mật khẩu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        ''
      )}
    </SafeAreaView>
  );
}

export default LoginScreen;
