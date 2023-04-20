import React, {useState} from 'react';
import {SafeAreaView, Text, View, Button} from 'react-native';

import Header from "../utils/components/header";
import styles from './style';

function CheckHealthScreen({navigation}) {
  const [showHealthCheck, setShowHealthCheck] = useState(false);

  //trả màn hình kiểm tra sức khỏe
  return (
    <SafeAreaView>
      <Header></Header>
      <View style={[styles.container,{paddingTop:50}]}>
        {showHealthCheck ? <HealthCheck/> : <Confirm setShowHealthCheck={setShowHealthCheck} />}      
      </View>
    </SafeAreaView>
  );
}

//component xác nhận kiểm tra
const Confirm = ({ setShowHealthCheck }) => {
  const handleButtonClick = () => {
    setShowHealthCheck(true);
  };

  return (
    <View style={[styles.subContainer, styles.confirmContainer]}>
      <Text style={styles.confirmTitle}>Bạn có xác nhận kiểm tra sức khỏe?</Text>
      <Button style={styles.confirmButton} title="Xác nhận" onPress={handleButtonClick} color="green" />
    </View>
  );
};

//component trả về kết quả kiểm tra sức khỏe
const HealthCheck = () => {
  return (
    <View style={styles.subContainer}>
      <Text style={styles.healthCheckTitle}>Nhịp tim(BPM):</Text>
      <Ruler value={35}
        normalStart={36}
        normalEnd={37.5}
        first={34}
        last={39}/>
      <View style={styles.healthCheckContentContainer}>
        <Text style={styles.healthCheckContent}>Thấp nhất: 96</Text>
        <Text style={[styles.healthCheckContent,styles.healthCheckContentSpecial]}>Trung bình:102</Text>
        <Text style={styles.healthCheckContent}>Cao nhất:110</Text>
      </View>

      <Text style={styles.healthCheckTitle}>Nồng độ oxy(%SpO2):</Text>
      <Ruler value={35}
        normalStart={36}
        normalEnd={37.5}
        first={34}
        last={39}/>
      <View style={styles.healthCheckContentContainer}>
        <Text style={styles.healthCheckContent}>Thấp nhất: 96</Text>
        <Text style={[styles.healthCheckContent,styles.healthCheckContentSpecial]}>Trung bình:102</Text>
        <Text style={styles.healthCheckContent}>Cao nhất:110</Text>
      </View>

      <Text style={styles.healthCheckTitle}>Nhiệt độ:(độ C)</Text>
      <Ruler value={37}
        normalStart={36}
        normalEnd={37.5}
        first={34}
        last={39}/>
      <View style={[styles.healthCheckContentContainer,{justifyContent:'space-around'}]}>
        <Text style={[styles.healthCheckContent,styles.healthCheckContentSpecial]}>Trung bình:37</Text>
      </View>
      <Text style={{textAlign:'center',marginTop:10,fontSize:26}}>Đánh giá sức khỏe:</Text>
      <Text style={{textAlign:'center',fontSize:38,fontWeight:'bold',}}>Tốt</Text>
    </View>
  );
};

// 36 - 37.5 bình thường
// đuôi trừ đầu
const Ruler = ({ value,normalStart,normalEnd,first=34,last=39}) => {
  const rulerWidth = 300; // Độ dài của thanh thước
  const sectionWidth = rulerWidth / 3; // Độ rộng của mỗi vùng màu
  
  const arrowLeft = (value) => {
    if (value <= first) {
      return - 7; // t < first set vị trí ngay đầu thanh
    } else if (value == normalStart) {
      return sectionWidth -3; // t = normalStart set vị trí trùng giao 2 thanh đầu
    }else if (value == normalEnd) {
      return -8; // t = normalEnd set vị trí trùng giao 2 thanh sau
    }else if (value >=last) {
      return sectionWidth - 4; // t >= last set vị trí cuối thanh cuối
    } else if (value > first && value < normalStart) {
      return sectionWidth + ((value - normalStart) / (normalStart - first)) * sectionWidth - 7; // first<t<normalStart thuộc thanh đầu
    }else if (value >normalStart && value <normalEnd) {
      return (value - normalStart) / (normalEnd - normalStart) * sectionWidth - 7; // normalStart<t<normalEnd thuộc thanh 2
    } else if (value > normalEnd && value < last) {
      return (value - normalEnd) / (last - normalEnd) * sectionWidth - 7; // normalEnd<t<last thuộc thanh cuối
    }
  }

  return (
    <View style={styles.rulerContainer}>
      <View style={[styles.rulerSection, { backgroundColor: 'yellow', width: sectionWidth }]}>
        {value <= 36 && <Text style={[styles.arrow, { left: arrowLeft(value) }]}>▼</Text>}
      </View>
      <View style={[styles.rulerSection, { backgroundColor: 'green', width: sectionWidth }]}>
        {value > 36 && value < 37.5 && <Text style={[styles.arrow, { left: arrowLeft(value) }]}>▼</Text>}
      </View>
      <View style={[styles.rulerSection, { backgroundColor: 'red', width: sectionWidth }]}>
        {value >= 37.5 && <Text style={[styles.arrow, { left: arrowLeft(value) }]}>▼</Text>}
      </View>
    </View>
  );
};

export default CheckHealthScreen;
