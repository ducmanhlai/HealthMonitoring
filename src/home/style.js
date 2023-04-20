import {StyleSheet, Dimensions} from 'react-native';
import COLOR from '../utils/color';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical:20,
      },

      outerCircle: {
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: COLOR.pink,
        justifyContent: 'center',
        alignItems: 'center',
      },

      innerCircle: {
        width: 330,
        height: 330,
        borderRadius: 165,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',        
        justifyContent: 'center',
      },

      heartRateContainer:{
        textAlign: 'center',
      },

      heartRateText: {
        fontSize: 64,
        fontWeight: 'bold',
        textAlign:'center',
        // backgroundColor:'blue',
      },

      heartRateUnit: {
        fontSize: 16,
        color: 'gray',
        textAlign:'center',
        // backgroundColor:'blue',
      },

      line:{
        marginVertical:10,
        width:200,
        height:2,
        backgroundColor:'grey',
      },

      infoContainer: {
        paddingHorizontal:30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },

      infoItem: {
        alignItems: 'center',
      },

      infoIcon: {
        fontSize: 20,
        color: 'gray',
        textAlign:'center',
        // backgroundColor:'blue',
      },

      infoText: {
        // marginTop: 1,
        fontSize: 44,
        color: 'black',
        textAlign:'center',
      },

      container_chart: {
        height: 250,
        backgroundColor: '#F5FCFF'
      },

      chart: {
        height: 200,
      },

      subContainer:{
        backgroundColor:COLOR.primary,
        width:350,
        height:390,
        borderRadius:30,
        textAlign: 'center',
      },
      confirmContainer:{
        paddingVertical:135,
        paddingHorizontal:60,

      },
      confirmTitle: {
        fontSize:23,
        textAlign:'center',
        fontWeight:'bold',
        marginBottom:10,
      },
      confirmButton:{
        borderRadius:30,
        backgroundColor:'red',
      },

      rulerContainer: {
        flexDirection: 'row',
        height: 10,
        marginHorizontal: 20,
        marginTop:10,
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

      healthCheckTitle:{
        fontSize:20,
        marginTop:20,
        paddingHorizontal:20,
        fontWeight:'bold',
      },

      healthCheckContentContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal:8,
      },

      healthCheckContent:{
        fontSize:14,
        textAlign:'center',
        marginTop:2,
      },

      healthCheckContentSpecial:{
        fontWeight:'bold',
        fontSize:16,
        marginTop:0,
      },

});

export default styles;
