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
    StatusBar
} from 'react-native';
import { Icon } from 'react-native-elements'
import EnterPhone from './EnterPhone'
import UploadProfilePicture from './UploadProfilePicture'
import CreateUsername from './CreateUsername'
import firebase from 'react-native-firebase';

var {height, width} = Dimensions.get('window');
export default class Login extends Component {
	

  state = {
    buttonPressed:false,
  }

  render() {
    if(this.state.buttonPressed){
      return(
          // <CreateUsername/>
        <EnterPhone onLogin = {this.props.onLogin} goBack = {()=>this.setState({buttonPressed:false})}/>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style = {styles.center}>
          <Image source={require('./../icons/NewFirstScreen.png')} 
          style={{width: height * 0.12, height: height*0.1}}/>
        </View> 

        <TouchableHighlight onPress={()=>this.login()} style = {styles.loginButton} underlayColor="rgba(255,255,255,0.1)">
        	<View style = {styles.tpSection}>
            <Text style={styles.loginText}>
		          Sign In
		        </Text>
           </View>
        </TouchableHighlight>

      </View>
    )
  }

  login(){
    firebase.analytics().logEvent("sign_in")
    this.setState({buttonPressed:true});
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9264f',
    // alignItems: 'center',
    justifyContent: 'flex-end',
  },

  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  loginButton:{
  	backgroundColor:'#00B0F0',
  	height: height*0.1,
  	alignItems:'center',
  	justifyContent:'center',
  },
  loginText:{
      color:'#fff',
      textAlign:'center',
      fontSize:height*0.041,
      fontWeight:'bold',
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