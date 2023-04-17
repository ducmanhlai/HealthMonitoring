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
      </View>
      <View style={styles.viewBtnLogin}>
        <TouchableOpacity>
          <View style={styles.btnLogin}>
            <Text style={styles.txtLogin}>Đăng nhập</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.viewTxtOther}>
          <TouchableOpacity>
            <Text style={styles.txtOther}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.txtOther}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;
