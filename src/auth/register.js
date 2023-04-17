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

function RegisterScreen({navigation}) {
  const [seePassword, setSeepassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.title1}>Chào mừng bạn</Text>
        <Text style={styles.title2}>ĐĂNG KÝ</Text>
        <View style={styles.headerBar}>
          <View style={styles.barHead2} />
          <View style={styles.barHead1} />
        </View>
      </View>
      <View style={styles.viewInput}>
        <View style={styles.viewIconInput}>
          <Fontisto style={styles.iconInput} name="email" size={20} />
          <TextInput style={styles.input} placeholder="Email" />
        </View>
        <View style={styles.lineInput} />
        <View style={styles.viewIconInput}>
          <FontAwesome5 style={styles.iconInput} name="unlock-alt" size={20} />
          <TextInput
            style={styles.input}
            secureTextEntry={seePassword}
            placeholder="Mật khẩu"
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
            secureTextEntry={seePassword}
            placeholder="Xác nhận mật khẩu"
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
        <TouchableOpacity>
          <View style={styles.btnLogin}>
            <Text style={styles.txtLogin}>Đăng ký</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={[styles.txtOther, {marginTop: 20}]}>
            Đã có tài khoản? Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default RegisterScreen;
