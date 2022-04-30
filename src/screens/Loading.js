import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    Alert,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    Image,
    StatusBar,
} from 'react-native';
import { Icon } from 'react-native-elements'

import firebase from 'react-native-firebase';
/*

              <View style = {styles.center}>
                <Image source={require('./../icons/NewFirstScreen.png')} 
                style={{width: height * 0.12, height: height*0.1}}/>
              </View> 


*/


var {height, width} = Dimensions.get('window');
export default class Loading extends Component {
	

  
  render() {
      return (
          <View style={styles.container}>
              <StatusBar barStyle = "light-content"/>
              <View style = {[styles.row, {backgroundColor:'#f9264f'}]}>
                
              </View>
              <View style = {{flex:1}}/>
              <View style = {styles.tabBar}/>

          </View>
      )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'flex-start',
  },

  tabBar:{
    backgroundColor:'#f7f7f7',
    borderTopColor:'rgba(0,0,0,.3)',
    // borderTopWidth:1,
    width:width,
    height:height*0.078,
  },

  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  loginButton:{
  	height: height/8,
  	alignItems:'center',
  	justifyContent:'center',
  },
  tpSection: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tpIcon: {
      padding: 10,
  },
  header: {
    fontSize: 20,
    marginVertical: 20,
  },
  submit:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'#fff',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  submitText:{

      marginLeft:10,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:20
  },
  timeplace:{
    marginRight:20,
    marginLeft:20,
    marginTop:0,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#f9264f',
  },

  timeplaceText:{
      color:'#fff',
      textAlign:'center',
      fontSize:30,
      marginLeft:10,
      fontWeight:'bold',
  },

  row:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',
    width:width,
    height:height*0.12,

  },
   planit:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'#f9264f',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  planitText:{
      color:'#fff',
      textAlign:'center',
      fontSize:30,
  },
});