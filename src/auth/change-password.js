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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../../App';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ChangePasswordScreen({route, navigation}) {
  const {setIsLogin, user, setUser} = useContext(AppContext);
  const [seeOldPassword, setSeeOldPassword] = useState(false);
  const [seePassword, setSeepassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const checkData = () => {
    if (oldPassword.trim().length == 0) {
      ToastAndroid.show('Không được để trống mật khẩu cũ!', ToastAndroid.SHORT);
      return false;
    }
    if (password.trim().length == 0) {
      ToastAndroid.show(
        'Không được để trống mật khẩu mới!',
        ToastAndroid.SHORT,
      );
      return false;
    }
    if (confirmPassword.trim().length == 0) {
      ToastAndroid.show(
        'Không được để trống xác nhận mật khẩu mới!',
        ToastAndroid.SHORT,
      );
      return false;
    }

    if (confirmPassword.trim() != password.trim()) {
      ToastAndroid.show(
        'Mật khẩu mới và xác nhận mật khẩu mới không khớp!',
        ToastAndroid.SHORT,
      );
      return false;
    }
    return true;
  };

  function changePass() {
    if (checkData()) {
      request
        .postPrivate(
          API.changPassword,
          {
            username: user.email,
            newPassword: password,
            oldPassword: oldPassword,
          },
          {'Content-Type': 'application/json', authorization: user.accessToken},
          'PATCH',
        ) 
        .then(response => {
          if (response.data.status == true) {
            ToastAndroid.show('Cập nhật thành công!', ToastAndroid.SHORT);
          } else {
            if (response.data.message == 'Token đã hết hạn') {
              getRefreshToken();
            } else {
              ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
              navigation.replace('LoginScreen');
            }
          }
        })
        .catch(err => {
          console.log(err);
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
        });
    }
  }
  async function getRefreshToken() {
    try {
      const res2 = await request.post(API.refeshToken, {
        token: user.refreshToken,
      });

      if (res2.data.status == true) {
        const account = response.data.data.user;
        const newUser = {
          email: account.email,
          id: account.userInfo['_id'],
          name: account.userInfo.name,
          imageUrl: account.userInfo.imageUrl,
          gender: account.userInfo.gender,
          birthDay: account.userInfo.birthDay,
          phoneNumber: account.userInfo.phoneNumber,
          familyPhoneNumber: account.userInfo.familyPhoneNumber,
          height: account.userInfo.height,
          weight: account.userInfo.weight,
          accessToken: response.headers.authorization,
          refreshToken: response.data.data.refreshToken,
        };
        //update user in side client
        setUser(newUser);

        //delete old user
        AsyncStorage.removeItem('user')
          .then(() => {
            console.log('user removed from AsyncStorage');
          })
          .catch(error => {
            console.error(error);
          });

        AsyncStorage.setItem('user', JSON.stringify(newUser))
          .then(() => console.log('Object stored successfully'))
          .catch(error => console.log('Error storing object: ', error));
        return true;
      } else {
        // Alert.alert('Thông báo!', res2.message + '', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);

        if (res2.data.message == 'Refesh token không hợp lệ!') {
          setUser(null);
          setIsLogin(false);
          //delete old user
          AsyncStorage.removeItem('user')
            .then(() => {
              console.log('user removed from AsyncStorage');
            })
            .catch(error => {
              console.error(error);
              ToastAndroid.show(error, ToastAndroid.SHORT);
            });
          navigation.replace('LoginScreen');
        }
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
    return false;
  }
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{marginLeft: -300}}>
          <Ionicons name="chevron-back" size={30} />
        </TouchableOpacity>
        <Text style={styles.title1}>Chào mừng bạn</Text>
        <Text style={styles.title2}>ĐỔI MẬT KHẨU</Text>

        <View style={styles.headerBar}>
          <View style={styles.barHead2} />
          <View style={styles.barHead1} />
        </View>
      </View>
      <View style={styles.viewInput}>
        <View style={styles.viewIconInput}>
          <FontAwesome5 style={styles.iconInput} name="unlock-alt" size={20} />
          <TextInput
            style={styles.input}
            secureTextEntry={!seeOldPassword}
            placeholder="Mật khẩu cũ"
            onChangeText={newText => setOldPassword(newText)}
          />

          <TouchableOpacity onPress={() => setSeeOldPassword(!seeOldPassword)}>
            {seeOldPassword ? (
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
        <View style={styles.viewIconInput}>
          <FontAwesome5 style={styles.iconInput} name="unlock-alt" size={20} />
          <TextInput
            style={styles.input}
            secureTextEntry={!seePassword}
            placeholder="Mật khẩu mới"
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
        <View style={styles.viewIconInput}>
          <FontAwesome5 style={styles.iconInput} name="unlock-alt" size={20} />
          <TextInput
            style={styles.input}
            secureTextEntry={!seeConfirmPassword}
            placeholder="Xác nhận mật khẩu mới"
            onChangeText={newText => setConfirmPassword(newText)}
          />

          <TouchableOpacity
            onPress={() => setSeeConfirmPassword(!seeConfirmPassword)}>
            {seeConfirmPassword ? (
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
        <TouchableOpacity onPress={() => changePass()}>
          <View style={styles.btnLogin}>
            <Text style={styles.txtLogin}>Đổi mật khẩu</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ChangePasswordScreen;
