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
import { Icon } from 'react-native-elements';
import EnterName from './EnterName';



import firebase from 'react-native-firebase';
// ()=>this.props.onLogin("asdf","asdf")
var {height, width} = Dimensions.get('window');
export default class Verification extends Component {
  componentDidMount(){

  //console.log(this.props.number);
    firebase.auth().signInWithPhoneNumber("+1"+this.props.number)
  .then(confirmResult => this.setState({confirmResult:confirmResult}))
  .catch(error => console.log(error));


  }
  state = {
    code:"",
    correctCodeEntered:false,
    confirmResult:'',
    newAccount:true,
    userid:'',
    }
  render() {

    if(this.state.correctCodeEntered){
      if(this.state.newAccount)
        return <EnterName userid = {this.state.userid} number =  {this.props.number} onLogin = {this.props.onLogin} goBack = {()=>this.setState({correctCodeEntered:false})}/>
      else{
        this.props.onLogin("asdf","fdsa");
      }
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />

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
              {'We sent you a code to verify\nyour number'}
            </Text>
            <Text style = {styles.sentText}>
              {'Sent to ' + this.formatPhoneNumber(this.props.number)}
            </Text>
            <TextInput
              autoGrow = {false}
              style={styles.promptInput}
              underlineColorAndroid='transparent'
              // onPress={() => this.submitSuggestion(this.props)}
              autoFocus = {true}
              placeholder = 'Code'
              placeholderTextColor= '#a8a8a8'
              returnKeyType = {'done'}
              keyboardType = 'number-pad'
              autoCapitalize = 'sentences'
              underlayColor='#fff'
              onChangeText={(code) => this.setState({correctCodeEntered: false, code : code.replace(/\D/g,'')})}
              value={this.state.code}
              // onSubmitEditing = {}
            />

        </View> 

      
        <KeyboardAvoidingView behavior = 'position'>
          <TouchableHighlight 
            onPress={()=>this.tryPhoneNumber()}//()=>this.setState({properNumberEntered:true, number:this.state.number})} 
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

  tryPhoneNumber(){
    firebase.analytics().logEvent("verification_code_entered")
    this.state.confirmResult.confirm(this.state.code)
      .then(user => this.checkIfNewUser(user))
      .catch(error => this.invalidCode());

    // this.checkIfNewUser();
    

  }

  checkIfNewUser(user){
    firebase.analytics().logEvent("correct_code_entered")
    //console.log(user);
    let userid = user._user.uid;
    //console.log(userid)
    // let userid= "deletethis";
    // let userid = "6BWdYou3bCcd6l28eb1iMuW6J9C3";
    // let userid = "26IhkLTnjrhuy2mnOeyWtJfg98w2";
    firebase.database().ref('Used_IDs/' + userid).once('value').then((snapshot) => {
      let userData = snapshot.val();
      if(userData == null){
        firebase.analytics().logEvent("new_user_creation_started");

        this.setState({correctCodeEntered:true, newAccount:true, userid:userid});
      }

      else{
        this.setState({correctCodeEntered:true, newAccount:false, userid:userid});
      }
      //console.log(userData);
    });
    // this.setState({correctCodeEntered:true, newAccount:true})
  }

  invalidCode(){
    firebase.analytics().logEvent("incorrect_code_entered")
  }

  isNumberValid(){
    let code = this.state.code;
    if(""+code.length == "6"){
      return true;
    }
  }

  formatPhoneNumber(s) {
    var s2 = (""+s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
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

  sentText:{
    fontSize:14,
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
  submit:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    backgroundColor:'#f9f9f9',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    // fontSize:30,
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

  status:{
    color:'#f9264f',
    width:width*0.5,
    height:height*0.01,
  }
});