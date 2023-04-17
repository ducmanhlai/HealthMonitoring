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

function ForgotPasswordScreen({navigation}) {
  const [seePassword, setSeepassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
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
          <TextInput style={styles.input} placeholder="Email" />
        </View>
        <View style={styles.lineInput} />
      </View>

      <View style={styles.viewBtnLogin}>
        <TouchableOpacity>
          <View style={styles.btnLogin}>
            <Text style={styles.txtLogin}>Xác nhận</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={[styles.txtOther, {marginTop: 20}]}>
            Đã nhớ mật khẩu? Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ForgotPasswordScreen;
