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
import CreatePassword from './CreatePassword'

import firebase from 'react-native-firebase';
// ()=>this.props.onLogin("asdf","asdf")
var {height, width} = Dimensions.get('window');
export default class CreateUsername extends Component {
  state = {
    username:"",
    usernameEntered:false,
    usernameTaken:false,
    invalidUsername:false,
  }
  render() {
    if(this.state.usernameEntered){
      
      return (<CreatePassword userid = {this.props.userid} number = {this.props.number} onLogin = {this.props.onLogin} goBack = {()=>this.setState({usernameEntered:false})} fullname = {this.props.fullname} username = {this.state.username.toLowerCase()}/>)

    }
    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style = {{backgroundColor:'#f9264f', width:width*0.5, height:height*0.01}}/>
      <View style = {styles.row}>
            <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.props.goBack()}>
              <Image source = {require('./../icons/Back2.png')} style = {styles.backButton}  />
            </TouchableHighlight>
          <View style = {styles.header}>
          </View>
        </View>
        <View style = {styles.topCenter}>

          <View style = {{height:height/10}}/>
            <Text style = {styles.promptText}>
              {'Create a username'}
            </Text>
            <TextInput
              autoGrow = {false}
              style={styles.submit}
              underlineColorAndroid='transparent'
              // onPress={() => this.submitSuggestion(this.props)}
              autoFocus = {true}
              placeholder = 'Username'
              placeholderTextColor= '#a8a8a8'
              returnKeyType = {'done'}
              keyboardType = 'default'
              autoCapitalize = 'none'
              underlayColor='#fff'
              onChangeText={(username) => this.setValidity(username)}
              value={this.state.username}
              // onSubmitEditing = {}
            />
            <Text style = {styles.errorText}>
            {this.state.invalidUsername ? "Only letters, numbers, and underscores allowed" : this.state.usernameTaken ? "Username taken" : ""}
            </Text>

        </View> 

      
        <KeyboardAvoidingView behavior = 'position'>
          <TouchableHighlight 
            onPress={()=>this.doubleCheckAndSet()} 
            style = {this.isUsernameValid() ? styles.continueButton : styles.enterValidButton} 
            underlayColor="rgba(255,255,255,0.1)"
            disabled = {!this.isUsernameValid()}
          >
            <View style = {styles.tpSection}>
              <Text style={[styles.timeplaceText, !this.isUsernameValid() ? {color:'#a8a8a8'}:{}]}>
                Continue
              </Text>
             </View>
          </TouchableHighlight>
        </KeyboardAvoidingView>

      </View>
    )
  }
  
  setValidity(passedUsername){
    this.setState({usernameEntered: false, username : passedUsername})
    let username = passedUsername.toLowerCase();
    if(username.replace(/\W/g, '') !== username){

      this.setState({invalidUsername:true});
      return false;
    }
    else{
      this.setState({invalidUsername:false})
    }

    if(username.length > 0){
      firebase.database().ref('Usernames/' + username).once('value').then((snapshot)=> {
        let userid = snapshot.val();
        if(userid !== null){
          this.setState({usernameTaken:true})
          return false;
        }
        // this.setState({validUsername:true})
        this.setState({usernameTaken:false})
        return true;
      });
    }
    else{
      // this.setState({invalidUsername:true})
      this.setState({usernameTaken:false})
    }
  }

  doubleCheckAndSet(){
    let username = this.state.username.toLowerCase();
    if(username.replace(/\W/g, '') !== username){
      this.setState({invalidUsername:true});
      return false;
    }
    else{
      this.setState({invalidUsername:false})
    }
    
    if(username.length > 0){
      firebase.database().ref('Usernames/' + username).once('value').then((snapshot)=> {
        let userid = snapshot.val();
        if(userid !== null){
          this.setState({usernameTaken:true})
          return false;
        }
        // this.setState({validUsername:true})
        this.setState({usernameTaken:false})
        this.setState({usernameEntered:true, username:this.state.username})
        return true;
      });
    }
    else{
      // this.setState({invalidUsername:true})
      this.setState({usernameTaken:false})

    }
    
    
  }

  isUsernameValid(){
    if(this.state.username.length > 0 && !(this.state.invalidUsername || this.state.usernameTaken)){
      return true;
    }
    return false;
  }



}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    //alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    // fontSize: 20,
    marginTop:  30,
    marginBottom: 20,
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
    fontSize:height*0.041,
    textAlign:'center',
  },

  errorText:{
    fontWeight:'bold',
    fontSize:14,
    textAlign:'center',
    color:'red',
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
    marginBottom: height*0.044,
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
    marginBottom:height*0.044,
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
  submit:{
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
});