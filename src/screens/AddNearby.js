import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';

// import {Button as uButton} from 'react-native-elements';
// import { Button } from 'react-native-elements'

import { List, ListItem, Icon } from 'react-native-elements'
import firebase from 'react-native-firebase';;
import User from '../helper/User.js'



var {height, width} = Dimensions.get('window');

export default class AddNearby extends Component {

  constructor() {
      super();

      this.state = {
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName'],
          currentUser:{},
          text:"",
      }
  }


  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <StatusBar barStyle = "dark-content"/>
        <View style = {styles.row}>
          <View style = {{flex:1,flexDirection:'row'}}>
           <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>goBack()}>
              <Image source = {require('./../icons/Back2.png')} style = {styles.backButton}  />
            </TouchableHighlight>
          </View>

          <Text style = {styles.header}>
            Add Nearby
          </Text>
          <View style = {{flex:1,flexDirection:'row'}}/>
         
        </View>

        <View style = {styles.divider}>
        </View>


        <View style = {styles.profile}>
          <Text style = {styles. header}>
            Coming soon!
          </Text>
        </View>
      </View>
    );
  }


  _navPropOrDefault(propName,defaultName = {}){
    return ((this.props.navigation.state.params && this.props.navigation.state.params[propName]) ? this.props.navigation.state.params[propName] : defaultName);
  }

  _passNavParameters(){
    let parameters = {};
    for (i in this.state.navParameters){
      let param = this.state.navParameters[i];
      parameters[param] = this._navPropOrDefault(param,'');
    }
    return parameters;
  }

  printState(){  
    //console.log(this.props);
  }

 
  getUserData(userid, responseFunction){
    //console.log("Getting uid: " + userid)
    firebase.database().ref('Users/' + userid).once('value').then((snapshot)=> {
      var userData = snapshot.val();
      // //console.log(userData);
      let boundResponse = responseFunction.bind(this);
      boundResponse(userData);
    });

  }


}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    //alignItems: 'center',
    justifyContent: 'flex-start',
  },

  divider:{
    borderBottomColor:'#e4e4e4',
    borderBottomWidth:1,
  },

  search: {
    height:height/14,
    width:width,
    flex:0,
    flexDirection:'row',
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'flex-start',
  },

  submit:{
    borderColor: '#fff',
    flex:1,
    marginLeft:10,
    borderBottomColor:'#e4e4e4'
  },
  submitText:{

      marginLeft:10,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:20
  },

  sectionText:{
    marginLeft:10,
    marginTop:10,
    marginBottom:10,
    fontSize:15,
    color:'#a8a8a8'
  },

 profile: {
    flex:1,
    backgroundColor: '#fff',
    justifyContent:'center',
    // height: height*0.8,
    alignItems:'center',

  },

  
  header: {
    fontSize: height*0.031,
    marginTop:  30,
    marginBottom: 20,
    textAlign: 'center',
    justifyContent: 'center',
    color:'black',
    fontWeight:'bold',
  },

  row:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',
    width:width,
    height:height*0.12,

  },

  backButton:
  { 
    marginLeft:10,
    marginTop:10,
    height:30,
    width:30,
    alignSelf:'flex-start'
  },


  
});