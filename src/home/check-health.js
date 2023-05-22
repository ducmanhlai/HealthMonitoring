import React, { useEffect, useState, useContext, useRef } from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../utils/components/header';
import styles from './style';
import API from '../utils/api';
import { post } from '../service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../App';

function CheckHealthScreen({ navigation }) {
  const [showHealthCheck, setShowHealthCheck] = useState(true);
  const [predict, setpredict] = useState('');

  //trả màn hình kiểm tra sức khỏe
  return (
    <SafeAreaView>
      <Header navigation={navigation} />
      <View style={[styles.container, { paddingTop: 50 }]}>
        {showHealthCheck ? (
          <HealthCheck
            showHealthCheck={showHealthCheck}
            setShowHealthCheck={setShowHealthCheck}
            predict={predict}
          />
        ) : (
          <Confirm
            setShowHealthCheck={setShowHealthCheck}
            setPredict={setpredict}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

//component xác nhận kiểm tra
const Confirm = ({ setShowHealthCheck, setPredict }) => {
  const [selectedCp, setSelectedCp] = useState('0');
  const [selectedExng, setSelectedExng] = useState('0');
  const handleButtonClick = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    console.log(user.id);
    setShowHealthCheck(true);
    console.log(selectedCp, selectedExng, new Date("2023-05-21T04:00:00.000+00:00"));
    const tmp = await post(API.predict + `/${user.id}`, {
      cp: Number(selectedCp),
      exng: Number(selectedExng),
      timeStamp: new Date("2023-05-21T04:00:00.000+00:00")
    },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: user.accessToken,
        },
      });
    console.log(tmp.data);
    setPredict(tmp.data.docterSaid);
  };

  return (
    <View style={[styles.subContainer, styles.confirmContainer]}>
      <Text style={styles.confirmTitle}>Kiểm tra sức khỏe:</Text>
      <View style={{ width: '145%', marginLeft: -50 }}>
        <Text>Tình trạng đau ngực:</Text>
        <Picker
          selectedValue={selectedCp}
          onValueChange={(itemValue, itemIndex) => setSelectedCp(itemValue)}>
          <Picker.Item label="Không có triệu chứng đau ngực" value="0" />
          <Picker.Item
            label="Đau ngực nhẹ nhàng hoặc không thoải mái"
            value="1"
            style={{ fontSize: 12 }}
          />
          <Picker.Item
            label="Đau ngực ở mức đủ để gây khó chịu, ảnh hưởng đến hoạt động"
            value="2"
            style={{ fontSize: 10 }}
          />
          <Picker.Item
            label="Đau ngực cực kỳ nghiêm trọng và không thể chịu đựng được"
            value="3"
            style={{ fontSize: 10 }}
          />
        </Picker>

        <Text>Tình trạng đau ngực sau vận động:</Text>
        <Picker
          selectedValue={selectedExng}
          onValueChange={(itemValue, itemIndex) => setSelectedExng(itemValue)}>
          <Picker.Item label="Có" value="1" />
          <Picker.Item label="Không" value="0" />
        </Picker>
      </View>
      <Button
        style={styles.confirmButton}
        title="Xác nhận"
        onPress={handleButtonClick}
        color="green"
      />
    </View>
  );
};

//component trả về kết quả kiểm tra sức khỏe
const HealthCheck = ({ showHealthCheck, setShowHealthCheck, predict }) => {
  const { spo2, setSpo2, bmp, setBMP, temp, setTemp } = useContext(AppContext);
  const [text, setText] = useState(predict);
  const handleButtonClick = () => {
    setShowHealthCheck(false);
  };
  useEffect(() => {
    setText(predict);
    console.log(predict);
  }, [predict]);

  // XỬ LÝ TỰ ĐỘNG GỌI API DỰ ĐOÁN

  /* 
    Ý tưởng:
    B1: Cần phải dự đoán ngay lập tức.
    B2: Đặt giá trị của isTheSameDay thành true.
    B3: Thực hiện dự đoán cho đến 23:59:59:999 cùng ngày.
    B4: Nếu đã thực hiện B3 và chưa thực hiện dự đoán cho ngày tiếp theo thì đặt giá trị isTheNextDay = true.
    B5: Thực hiện dự đoán cho ngày tiếp theo và tiếp tục B5 như vậy đến khi reset app.
  */

  /*
    Có ba trạng thái dự đoán:
    - Trạng thái 1: Dự đoán ngay lập tức khi người dùng mở màn hình dự đoán.
    - Trạng thái 2: Dự đoán từ lúc mở màn hình dự đoán cho đến hết 23:59:59:999 cùng ngày.
    - Trạng thái 3: Dự đoán từ 00:00:00:0000 của ngày tiếp theo cho đến 23:59:59:999 cùng ngày.
    Lưu ý: Trạng thái số 1 và số 2 chỉ được phép thực hiện đúng một lần mỗi khi mở màn hình dự đoán, còn trạng thái số 3 sẽ
    được phép thực hiện vô hạn cho đến khi tắt app.
  */

  // CÁC BƯỚC XỬ LÝ.
  // A - Tiền xử lý:
  // Lấy giờ từ lúc mở màn hình dự đoán.
  const curDate = new Date();
  console.log("Current Time:", curDate);
  // Lấy giờ thời gian bắt đầu của một ngày dựa trên biến curDate (00:00:00:0000).
  const startDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
  console.log("StartDate:", startDate);
  // Lấy giờ thời gian kết thúc của một ngày dựa trên biến curDate (23:59:59:999).
  const endDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 23, 59, 59, 999);
  console.log("EndDate:", endDate);
  // Tính toán ra thời gian delay để gọi API theo từng trạng thái.
  // delay của trạng thái 1.
  const millisecondRightaway = 2000;
  // delay của trạng thái 2.
  const millisecondsInCurDay = endDate - curDate;
  console.log("Cur Mili:", millisecondsInCurDay);
  // delay của trạng thái 3.
  const millisecondsInDay = endDate - startDate;
  // delay để huỷ đi hàm tự động gọi. Điều này tránh sự lặp lại vô hạn của hàm tự động gọi API.
  const delay = 500;
  console.log("Auto Time:", millisecondsInDay);
  // Tạo ra hai biến isTheSameDay và isTheNextDay để quản lý trạng thái delay khi gọi API.
  const [isTheSameDay, setIsTheSameDay] = useState(false);
  const [isTheNextDay, setIsTheNextDay] = useState(false);

  // B - Xử lý tự động gọi API:
  // Sử dụng useEffect để theo dõi sự thay đổi của hai biến isTheSameDay và isTheNextDay để từ đây tạo ra hàm tự động gọi API
  // sau một khoảng thời gian theo trạng thái.
  useEffect(() => {

    // Nếu chưa thực hiện trạng thái dự đoán số 2.
    if (!isTheSameDay) {
      // Thực hiện trạng thái dự đoán số 1. Tại đây delay là sau millisecondRightaway.
      const interval = setInterval(() => {
        auto();
        console.log(text);
      }, millisecondRightaway);

      console.log("First Form Done!");

      // Sau khi dự đoán thì tiến hành huỷ đi hàm tự động gọi API để tránh lặp lại vô hạn việc dự đoán trạng thái 1.
      setTimeout(() => {
        // Huỷ đi hàm tự động.
        clearInterval(interval);
        // Sau khi thực hiện trạng thái dự đoán 1, đặt trạng thái dự đoán 2 sẵn sàng.
        setIsTheSameDay(true);
      }, millisecondRightaway + delay);
    }
    // Chỉ khi trạng thái dự đoán số 2 sẵn sàng và trạng thái dự đoán số 3 chưa được gọi đến thì thực hiện trạng thái dự đoán số 2.
    else if (isTheSameDay && !isTheNextDay) {
      // Thực hiện trạng thái dự đoán số 2. Tại đây delay là sau millisecondsInCurDay.
      const interval = setInterval(() => {
        auto();
        console.log(text);
      }, millisecondsInCurDay);

      console.log("Second Form Done!");

      // Sau khi dự đoán thì tiến hành huỷ đi hàm tự động gọi API để tránh lặp lại vô hạn việc dự đoán trạng thái 2.
      setTimeout(() => {
        // Huỷ đi hàm tự động.
        clearInterval(interval);
        // Sau khi thực hiện trạng thái dự đoán 2, đặt trạng thái dự đoán 3 sẵn sàng.
        setIsTheNextDay(true);
      }, millisecondsInCurDay + delay);
    }

    // Khi trạng thái dự đoán số 3 đã sẵn sàng thì bắt đầu việc dự đoán lặp đi lặp lại sau mỗi một ngày.
    if (isTheNextDay) {
      // Thực hiện trạng thái dự đoán số 3. Tại đây delay là sau millisecondsInDay.
      // Lưu ý: Không có hàm huỷ vì trạng thái số 3 sẽ được gọi vô hạn.
      const interval = setInterval(() => {
        auto();
        console.log(text);
      }, millisecondsInDay);

      console.log("Third Form was called!");
    }

  }, [isTheSameDay, isTheNextDay]);

  // Hàm gọi API.
  const auto = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    console.log(user.id);
    setShowHealthCheck(true);
    console.log(0, 0, new Date());
    const tmp = await post(API.predict + `/${user.id}`, {
      cp: Number(0),
      exng: Number(0),
      timeStamp: new Date()
    },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: user.accessToken,
        },
      });
    console.log(tmp.data);
    setText(tmp.data.docterSaid);
  };


  return (
    <View style={styles.subContainer}>
      <Text style={styles.healthCheckTitle}>Nhịp tim(BPM): {bmp} bmp</Text>
      <Ruler
        value={bmp}
        normalStart={36}
        normalEnd={37.5}
        first={34}
        last={39}
      />
      <View style={styles.healthCheckContentContainer}>
        <Text style={styles.healthCheckContent}>Thấp nhất: 96</Text>
        <Text
          style={[styles.healthCheckContent, styles.healthCheckContentSpecial]}>
          Trung bình:102
        </Text>
        <Text style={styles.healthCheckContent}>Cao nhất:110</Text>
      </View>

      <Text style={styles.healthCheckTitle}>Nồng độ oxy(SpO2): {spo2} % </Text>
      <Ruler
        value={spo2}
        normalStart={36}
        normalEnd={37.5}
        first={34}
        last={39}
      />
      <View style={styles.healthCheckContentContainer}>
        <Text style={styles.healthCheckContent}>Thấp nhất: 96</Text>
        <Text
          style={[styles.healthCheckContent, styles.healthCheckContentSpecial]}>
          Trung bình:102
        </Text>
        <Text style={styles.healthCheckContent}>Cao nhất:110</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <Text style={styles.healthCheckTitle}>
          Nhiệt độ(Temp): {Number(temp)}</Text>
        <Text style={[styles.healthCheckTitle, { lineHeight: 15,left:-38,fontSize:14 }]}>o</Text>
        <Text style={[styles.healthCheckTitle,{left:-78}]}>C</Text>
      </View>

      <Ruler
        value={temp}
        normalStart={36.3}
        normalEnd={37.5}
        first={34}
        last={39}
      />
      <View
        style={[
          styles.healthCheckContentContainer,
          { justifyContent: 'space-around' },
        ]}>
        <Text style={styles.healthCheckContent}>Thấp nhất: 96</Text>
        <Text
          style={[styles.healthCheckContent, styles.healthCheckContentSpecial]}>
          Trung bình:37
        </Text>
        <Text style={styles.healthCheckContent}>Thấp nhất: 96</Text>
      </View>
      <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 22 }}>
        Đánh giá sức khỏe:
      </Text>
      <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
        {text ? text : 'Đang xử lý!'}
      </Text>
      <Button
        style={styles.confirmButton}
        title="Trở lại kiểm tra sức khỏe"
        onPress={handleButtonClick}
        color="green"
        width="80"
      />
    </View>
  );
};

// 36 - 37.5 bình thường
// đuôi trừ đầu
const Ruler = ({ value, normalStart, normalEnd, first = 34, last = 39 }) => {
  const rulerWidth = 300; // Độ dài của thanh thước
  const sectionWidth = rulerWidth / 3; // Độ rộng của mỗi vùng màu

  const arrowLeft = value => {
    if (value <= first) {
      return -7; // t < first set vị trí ngay đầu thanh
    } else if (value == normalStart) {
      return sectionWidth - 3; // t = normalStart set vị trí trùng giao 2 thanh đầu
    } else if (value == normalEnd) {
      return -8; // t = normalEnd set vị trí trùng giao 2 thanh sau
    } else if (value >= last) {
      return sectionWidth - 4; // t >= last set vị trí cuối thanh cuối
    } else if (value > first && value < normalStart) {
      return (
        sectionWidth +
        ((value - normalStart) / (normalStart - first)) * sectionWidth -
        7
      ); // first<t<normalStart thuộc thanh đầu
    } else if (value > normalStart && value < normalEnd) {
      return (
        ((value - normalStart) / (normalEnd - normalStart)) * sectionWidth - 7
      ); // normalStart<t<normalEnd thuộc thanh 2
    } else if (value > normalEnd && value < last) {
      return ((value - normalEnd) / (last - normalEnd)) * sectionWidth - 7; // normalEnd<t<last thuộc thanh cuối
    }
  };

  return (
    <View style={styles.rulerContainer}>
      <View
        style={[
          styles.rulerSection,
          { backgroundColor: 'yellow', width: sectionWidth },
        ]}>
        {value <= 36 && (
          <Text style={[styles.arrow, { left: arrowLeft(value) }]}>▼</Text>
        )}
      </View>
      <View
        style={[
          styles.rulerSection,
          { backgroundColor: 'green', width: sectionWidth },
        ]}>
        {value > 36 && value < 37.5 && (
          <Text style={[styles.arrow, { left: arrowLeft(value) }]}>▼</Text>
        )}
      </View>
      <View
        style={[
          styles.rulerSection,
          { backgroundColor: 'red', width: sectionWidth },
        ]}>
        {value >= 37.5 && (
          <Text style={[styles.arrow, { left: arrowLeft(value) }]}>▼</Text>
        )}
      </View>
    </View>
  );
};

export default CheckHealthScreen;
