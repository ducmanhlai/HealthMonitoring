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

function LoginScreen({navigation}) {
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
  return (
    <SafeAreaView>
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
          <FontAwesome5 style={styles.iconInput} name="unlock-alt" size={20} />
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
        <TouchableOpacity onPress={() => checkData()}>
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
    </SafeAreaView>
  );
}

export default LoginScreen;
