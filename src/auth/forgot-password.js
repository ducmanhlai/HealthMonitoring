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

function ForgotPasswordScreen({navigation}) {
  const [email, setEmail] = useState('');
  const checkData = () => {
    if (email.trim().length == 0) {
      ToastAndroid.show('Không được để trống email!', ToastAndroid.SHORT);
      return false;
    }

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) !== true) {
      ToastAndroid.show('Email không hợp lệ!', ToastAndroid.SHORT);
      return false;
    }
    return true;
  };
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.title1}>Chào mừng bạn</Text>
        <Text style={styles.title2}>QUÊN MẬT KHẨU</Text>
        <View style={styles.headerBar}>
          <View style={styles.barHead1} />
          <View style={styles.barHead2} />
        </View>
      </View>

      <View style={styles.viewInput}>
        <Text>Vui lòng nhập email đã đăng ký tài khoản của bạn!</Text>
        <View style={styles.viewIconInput}>
          <Fontisto style={styles.iconInput} name="email" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={newText => setEmail(newText)}
          />
        </View>
        <View style={styles.lineInput} />
      </View>

      <View style={styles.viewBtnLogin}>
        <TouchableOpacity onPress={() => checkData()}>
          <View style={styles.btnLogin}>
            <Text style={styles.txtLogin}>Xác nhận</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={[styles.txtOther, {marginTop: 20}]}>
            Đã nhớ mật khẩu? Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ForgotPasswordScreen;
