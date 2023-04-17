import {StyleSheet, Dimensions} from 'react-native';
import COLOR from '../utils/color';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 126,
    width: width,
    backgroundColor: COLOR.primary,
  },
  title1: {
    fontSize: 18,
    color: COLOR.black,
  },
  title2: {
    fontSize: 28,
    color: COLOR.black,
    fontWeight: 'bold',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barHead1: {
    width: 44,
    height: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLOR.black,
    backgroundColor: COLOR.white,
    marginRight: 3,
  },
  barHead2: {
    width: 44,
    height: 8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLOR.black,
    backgroundColor: COLOR.pink,
    marginLeft: 3,
  },
  viewInput: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: 284,
    fontSize: 18,
  },
  viewIconInput: {
    flexDirection: 'row',
  },
  iconInput: {
    marginTop: 15,
  },
  lineInput: {
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.black,
  },
  viewBtnLogin: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  btnLogin: {
    backgroundColor: COLOR.primary,
    borderRadius: 30,
    height: 47,
    width: 185,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtLogin: {
    color: COLOR.black,
    fontSize: 20,
    fontWeight: '500',
  },
  viewTxtOther: {
    flexDirection: 'row',
    width: width * 0.8,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  txtOther: {
    color: COLOR.black,
    fontSize: 16,
    fontWeight: '600',
  },
  viewInforPerson: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTitleInfor: {
    flexDirection: 'row',
    width: width * 0.9,
    marginTop: 10,
  },
  txtTitleInfor: {
    color: COLOR.black,
    fontSize: 25,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  imgAvatar: {
    height: 100,
    width: 100,
    borderRadius: 100,
    marginTop: 20,
    borderWidth: 2,
    borderColor: COLOR.black,
  },
  viewInputInfor: {
    width: width,
    marginTop: 20,
    marginBottom: 20,
  },
  viewInputInfor2: {
    marginLeft: 20,
    marginTop: 10,
  },
  txtTitleInpurInfor: {
    fontSize: 20,
    color: COLOR.black,
    fontWeight: 'bold',
  },
  inputInfor: {
    borderBottomWidth: 1,
    width: width * 0.9,
    borderColor: COLOR.black,
    marginBottom: 10,
    marginTop: -10,
  },
  inputGender: {
    flexDirection: 'row',
  },
  txtGender: {
    marginTop: 5,
    fontSize: 18,
  },
  txtChonAnh: {
    color: COLOR.sencondary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 5,
  },
});

export default styles;
