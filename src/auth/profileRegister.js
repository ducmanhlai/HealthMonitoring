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

function ProfileRegisterScreen({navigation}) {
  const [checked, setChecked] = React.useState('male');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [imageUrl, setImageUrl] = useState(
    `https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/OOjs_UI_icon_userAvatar-progressive.svg/2048px-OOjs_UI_icon_userAvatar-progressive.svg.png`,
  );

  const [responseImage, setResponseImage] = useState(
    `https://freesvg.org/img/abstract-user-flat-4.png`,
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

    if (Number(weight) < 2 || Number(height) > 150) {
      ToastAndroid.show('Cân nặng không hợp lệ!', ToastAndroid.SHORT);
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

  const takePicture = () => {
    requestCameraPermission();
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

  return (
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
            onChangeText={newtext => setName(newtext)}
          />
        </View>
        <View style={styles.viewInputInfor2}>
          <Text style={styles.txtTitleInpurInfor}>Giới tính</Text>
          <View style={styles.inputGender}>
            <RadioButton
              value="male"
              status={checked === 'male' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('male')}
              color={COLOR.primary}
            />
            <Text style={styles.txtGender}>Nam</Text>

            <RadioButton
              value="female"
              status={checked === 'female' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('female')}
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
                value={date.toLocaleDateString()} // Display selected date in TextInput
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
            onChangeText={newtext => setHeight(newtext)}
          />
        </View>
        <View style={styles.viewInputInfor2}>
          <Text style={styles.txtTitleInpurInfor}>Cân nặng (kg)</Text>
          <TextInput
            style={styles.inputInfor}
            placeholder="Nhập cân nặng người đeo"
            keyboardType="numeric"
            onChangeText={newtext => setWeight(newtext)}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (checkData()) {
            navigation.navigate('RegisterScreen');
          }
        }}>
        <View style={styles.btnLogin}>
          <Text style={styles.txtLogin}>Xác nhận</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ProfileRegisterScreen;
