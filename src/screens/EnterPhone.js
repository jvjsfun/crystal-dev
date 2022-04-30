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
    KeyboardAvoidingView,
    StatusBar
} from 'react-native';
import { Icon } from 'react-native-elements'
import Verification from './Verification'
import UploadProfilePicture from './UploadProfilePicture'

import firebase from 'react-native-firebase';
// ()=>this.props.onLogin("asdf","asdf")
var {height, width} = Dimensions.get('window');
export default class EnterPhone extends Component {
  state = {
    number:"",
    properNumberEntered:false,
  }

  componentDidMount(){
    

  }

  render() {

    if(this.state.properNumberEntered){
      ()=>this.props.onLogin("asdf","asdf");
      return (<Verification number =  {this.state.number} onLogin = {this.props.onLogin} goBack = {()=>this.setState({properNumberEntered:false})}/>)

    }
    return (

      <View style={styles.container}>
      <StatusBar hidden={true} />


      
      <View style = {styles.row}>
            <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.props.goBack()}>
              <Image source = {require('./../icons/Back2.png')} style = {styles.backButton}  />
            </TouchableHighlight>
          <View style = {styles.phonePromptGap}>
          </View>
        </View>
        <View style = {styles.topCenter}>

          <View style = {{height:height/10}}/>
            <Text style = {styles.promptText}>
              {'To identify you,\nwe need your phone number'}
            </Text>
            <TextInput
              autoGrow = {false}
              style={styles.promptInput}
              underlineColorAndroid='transparent'
              // onPress={() => this.submitSuggestion(this.props)}
              autoFocus = {true}
              placeholder = 'Phone Number'
              placeholderTextColor= '#a8a8a8'
              returnKeyType = {'done'}
              keyboardType = 'number-pad'
              autoCapitalize = 'sentences'
              underlayColor='#fff'
              onChangeText={(number) => this.setState({properNumberEntered: false, number : number.replace(/\D/g,'')})}
              value={this.state.number}
              // onSubmitEditing = {}
            />

        </View> 

      
        <KeyboardAvoidingView behavior = 'position'>
          <TouchableHighlight 
            onPress={()=>this.enterPhoneNumber()} 
            style = {this.isNumberValid() ? styles.continueButton : styles.enterValidButton} 
            underlayColor="rgba(255,255,255,0.1)"
            disabled = {!this.isNumberValid()}
          >
          	<View style = {styles.tpSection}>
              <Text style={[styles.timeplaceText, !this.isNumberValid() ? {color:'#a8a8a8'}:{}]}>
  		          Continue
  		        </Text>
             </View>
          </TouchableHighlight>
        </KeyboardAvoidingView>

      </View>
    )
  }

  enterPhoneNumber(){
    this.setState({properNumberEntered:true, number:this.state.number})
    firebase.analytics().logEvent("phone_number_entered")
  }

  isNumberValid(){
    let number = this.state.number;
    if(""+number.length == 10){
      return true;
    }
  }
}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    //alignItems: 'center',
    justifyContent: 'flex-start',
  },
  phonePromptGap: {
    // fontSize: 20,
    height:height*0.08,
    // textAlign: 'center',
    // justifyContent: 'center',
    // color:'black',
    // fontWeight:'bold',
    // alignSelf:'center',
    flex:1,
    flexDirection:'row'

  },

  promptText:{
    fontWeight:'bold',
    fontSize:height*0.031,
    textAlign:'center',
  },

  promptInput:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    backgroundColor:'#f9f9f9',
    borderRadius:10,
    // borderWidth: 1,
    borderColor: '#fff',
    fontSize:height*0.041,
    width:width*0.8,
    textAlign:'center',
  },

  row:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',
    width:width,
    flex:0

  },

  backButton:
  { 
    marginTop:10,
    height:30,
    width:30,
    alignSelf:'flex-start'
  },

  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },

  topCenter:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center'
  },

  continueButton:{
    backgroundColor:'#f9264f',
    height: height/16,
    marginHorizontal:40,
    marginBottom:20,
    alignItems:'center',
    borderRadius: 20,
    justifyContent:'center',
    borderWidth:1,
    borderColor:'#f9264f'
  },

  enterValidButton:{
    backgroundColor:'#f9f9f9',
    borderWidth:1,
    borderColor:'#a8a8a8',
    height: height/16,
    marginHorizontal:40,
    marginBottom:20,
    alignItems:'center',
    borderRadius: 20,
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
      fontSize:15,
      marginLeft:10,
      fontWeight:'bold',
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

  status:{
    color:'#f9264f',
    width:width*0.25,
    height:height*0.01,
  }



});