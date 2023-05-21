import React, {useState, useContext, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import styles from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import COLOR from '../utils/color';
import {RadioButton} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import {uploadImage} from '../service/uploadImage';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {AppContext} from '../../App';
import * as request from '../service';
import API from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfileScreen({navigation}) {
  const {isLogin, setIsLogin, user, setUser} = useContext(AppContext);
  const [checked, setChecked] = useState('nam');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [yourPhone, setYourPhone] = useState('');
  const [relativePhone, setRelativePhone] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [imageUrl, setImageUrl] = useState(
    `https://freesvg.org/img/abstract-user-flat-4.png`,
  );

  const [responseImage, setResponseImage] = useState(
    isLogin
      ? user.imageUrl
      : `https://freesvg.org/img/abstract-user-flat-4.png`,
  );
  const chooseImage = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // console.log('source', response.assets[0].uri);

        // setImageUrl(response.assets[0].uri);
        // setResponseImage(response);
        const url = await uploadImage(response.assets[0].uri);
        setImageUrl(response.assets[0].uri);

        setResponseImage(url);
      }
    });
  };

  const checkData = () => {
    if (name.trim().length == 0) {
      ToastAndroid.show('Không được bỏ trống tên!', ToastAndroid.SHORT);
      return false;
    }
    if (name.trim().length < 5) {
      ToastAndroid.show('Tên tối thiểu 5 kí tự!', ToastAndroid.SHORT);
      return false;
    }
    if (height.trim().length == 0) {
      ToastAndroid.show('Không được bỏ trống chiều cao!', ToastAndroid.SHORT);
      return false;
    }
    if (weight.trim().length == 0) {
      ToastAndroid.show('Không được bỏ trống cân nặng!', ToastAndroid.SHORT);
      return false;
    }

    const today = moment(new Date());

    if (moment(date).diff(today, 'days') > -5 * 365) {
      ToastAndroid.show('Tối thiểu 5 tuổi!', ToastAndroid.SHORT);
      return false;
    }

    if (Number(height) < 20 || Number(height) > 200) {
      ToastAndroid.show('Chiều cao không hợp lệ!', ToastAndroid.SHORT);
      return false;
    }

    if (Number(weight) < 2 || Number(weight) > 150) {
      ToastAndroid.show('Cân nặng không hợp lệ!', ToastAndroid.SHORT);
      return false;
    }
    if (yourPhone.trim().length < 10) {
      ToastAndroid.show(
        'Số điện thoại cá nhân phải đủ 10 số!',
        ToastAndroid.SHORT,
      );
      return false;
    }
    if (relativePhone.trim().length < 10) {
      ToastAndroid.show(
        'Số điện thoại người thân phải đủ 10 số!',
        ToastAndroid.SHORT,
      );
      return false;
    }

    return true;
  };

  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cấp quyền sử dụng',
          message: 'Ứng dụng cần quyền truy cập vào máy ảnh của bạn.',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Hủy bỏ',
          buttonPositive: 'Đồng ý',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        ToastAndroid.show('Đã cấp quyền truy cập máy ảnh!', ToastAndroid.SHORT);
      } else {
        console.log(granted);
        console.log('Camera permission denied');
        ToastAndroid.show(
          'Đã từ chối quyền truy cập máy ảnh!',
          ToastAndroid.SHORT,
        );
      }
    } catch (err) {
      console.warn(err);
      ToastAndroid.show(err, ToastAndroid.SHORT);
    }
  }

  const takePicture = async () => {
    await requestCameraPermission();
    const options = {
      title: 'Chọn ảnh',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // console.log('source', response);

        const url = await uploadImage(response.assets[0].uri);
        setImageUrl(response.assets[0].uri);

        setResponseImage(url);
      }
    });
  };

  useEffect(() => {
    if (isLogin) {
      setChecked(user.gender);
      setDate(new Date(user.birthDay));
      setName(user.name);
      setYourPhone(user.phoneNumber);
      setRelativePhone(user.familyPhoneNumber);
      setHeight(user.height);
      setWeight(user.weight);
      setImageUrl(user.imageUrl);
    }
  }, []);

  const update = async () => {
    if (checkData()) {
      request
        .postPrivate(
          '/account/' + user.id + '/update',
          {
            name: name,
            imageUrl: responseImage,
            gender: checked,
            birthDay: moment(date).format('YYYY-MM-DD'),
            phoneNumber: yourPhone,
            familyPhoneNumber: relativePhone,
            height: height,
            weight: weight,
          },
          {'Content-Type': 'application/json', authorization: user.accessToken},
          'PUT',
        )
        .then(response => {
          if (response.data.status == true) {
            const newUser = {
              email: user.email,
              id: user.id,
              name: name,
              imageUrl: responseImage,
              gender: checked,
              birthDay: moment(date).format('YYYY-MM-DD'),
              phoneNumber: yourPhone,
              familyPhoneNumber: relativePhone,
              height: height,
              weight: weight,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
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

            ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          } else {
            if (response.data.message == 'Token đã hết hạn') {
              getRefreshToken();
            } else ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          }
        })
        .catch(err => {
          console.log(err);
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
        });
    }
  };

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
    <ScrollView>
      <SafeAreaView style={styles.viewInforPerson}>
        <View style={styles.viewTitleInfor}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Ionicons name="chevron-back" size={30} />
          </TouchableOpacity>
          <Text style={styles.txtTitleInfor}>Thông tin người đeo</Text>
        </View>

        <Image
          source={{
            uri: `${imageUrl}`,
          }}
          style={styles.imgAvatar}
        />
        <View style={styles.inputGender}>
          <TouchableOpacity onPress={() => takePicture()}>
            <Entypo name="camera" size={30} color={COLOR.sencondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => chooseImage()}>
            <Text style={styles.txtChonAnh}>Chọn ảnh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewInputInfor}>
          <View style={styles.viewInputInfor2}>
            <Text style={styles.txtTitleInpurInfor}>Họ tên</Text>
            <TextInput
              style={styles.inputInfor}
              placeholder="Nhập họ tên người đeo"
              defaultValue={name}
              onChangeText={newtext => setName(newtext)}
            />
          </View>
          <View style={styles.viewInputInfor2}>
            <Text style={styles.txtTitleInpurInfor}>Giới tính</Text>
            <View style={styles.inputGender}>
              <RadioButton
                value="nam"
                status={checked === 'nam' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('nam')}
                color={COLOR.primary}
              />
              <Text style={styles.txtGender}>Nam</Text>

              <RadioButton
                value="nu"
                status={checked === 'nu' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('nu')}
                color={COLOR.primary}
              />
              <Text style={styles.txtGender}>Nữ</Text>
            </View>
          </View>
          <View style={styles.viewInputInfor2}>
            <Text style={styles.txtTitleInpurInfor}>Sinh nhật</Text>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <View style={styles.inputGender}>
                <TextInput
                  value={moment(date).format('DD/MM/YYYY')} // Display selected date in TextInput
                  style={styles.input}
                  editable={false} // Disable editing of TextInput
                />
                <Entypo name="calendar" size={30} color={COLOR.sencondary} />
              </View>
            </TouchableOpacity>
            <DatePicker
              modal
              open={open}
              date={date}
              mode="date"
              onConfirm={date => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
          <View style={styles.viewInputInfor2}>
            <Text style={styles.txtTitleInpurInfor}>Chiều cao (cm)</Text>
            <TextInput
              style={styles.inputInfor}
              placeholder="Nhập chiều cao người đeo"
              keyboardType="numeric"
              defaultValue={height}
              onChangeText={newtext => setHeight(newtext)}
            />
          </View>
          <View style={styles.viewInputInfor2}>
            <Text style={styles.txtTitleInpurInfor}>Cân nặng (kg)</Text>
            <TextInput
              style={styles.inputInfor}
              placeholder="Nhập cân nặng người đeo"
              keyboardType="numeric"
              defaultValue={weight}
              onChangeText={newtext => setWeight(newtext)}
            />
          </View>
          <View style={styles.viewInputInfor2}>
            <Text style={styles.txtTitleInpurInfor}>
              Số điện thoại (cá nhân)
            </Text>
            <TextInput
              style={styles.inputInfor}
              placeholder="Nhập số điện thoại cá nhân"
              keyboardType="numeric"
              defaultValue={yourPhone}
              onChangeText={newtext => setYourPhone(newtext)}
            />
          </View>
          <View style={styles.viewInputInfor2}>
            <Text style={styles.txtTitleInpurInfor}>
              Số điện thoại (người thân)
            </Text>
            <TextInput
              style={styles.inputInfor}
              placeholder="Nhập số điện thoại người thân"
              keyboardType="numeric"
              defaultValue={relativePhone}
              onChangeText={newtext => setRelativePhone(newtext)}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            update();
          }}>
          <View style={styles.btnLogin}>
            <Text style={styles.txtLogin}>Xác nhận</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

export default ProfileScreen;
