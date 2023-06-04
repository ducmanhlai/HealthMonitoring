import {StyleSheet, Dimensions} from 'react-native';
import COLOR from '../utils/color';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  
  statusContainer: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },

  circle:{
    width:10,
    height:10,
    borderRadius: 5,
    alignSelf:'center',
    marginRight:5,
  },

  statusText: {
    fontSize: 14,
    fontWeight:'bold',
  },

  outerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: COLOR.pink,
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  heartRateContainer: {
    textAlign: 'center',
  },

  heartRateText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    // backgroundColor:'blue',
  },

  heartRateUnit: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    // backgroundColor:'blue',
  },

  line: {
    marginVertical: 10,
    width: 90,
    height: 2,
    backgroundColor: 'grey',
  },

  infoContainer: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },

  infoItem: {
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    // backgroundColor:'blue',
  },

  infoText: {
    // marginTop: 1,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },

  containerChart: {
    height: 350,
    backgroundColor: '#F5FCFF',
  },

  chart: {
    height: 300,
  },

  subContainer: {
    backgroundColor: COLOR.primary,
    width: 350,
    height: 390,
    borderRadius: 30,
    textAlign: 'center',
  },
  confirmContainer: {
    paddingVertical: 60,
    paddingHorizontal: 60,
  },
  confirmTitle: {
    fontSize: 23,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmButton: {
    borderRadius: 30,
    backgroundColor: 'red',
  },

  rulerContainer: {
    flexDirection: 'row',
    height: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },

  rulerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    color: 'white',
    fontSize: 14,
    position: 'absolute',
    top: -14,
  },

  healthCheckTitle: {
    fontSize: 20,
    marginTop: 20,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },

  healthCheckContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  healthCheckContent: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },

  healthCheckContentSpecial: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 0,
  },
});

export default styles;
