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
    Platform,
    KeyboardAvoidingView,
    StatusBar
} from 'react-native';
import { Icon } from 'react-native-elements'
import bcrypt from 'react-native-bcrypt'
import firebase from 'react-native-firebase';
import RNFetchBlob from 'react-native-fetch-blob';



var ImagePicker = require('react-native-image-picker');
var {height, width} = Dimensions.get('window');


// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  quality:0.035,
  // takePhotoButtonTitle:null,
};



const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class UploadProfilePicture extends Component {
  state = {
    password:"",
    passwordEntered:false,
    passwordHash:'',
    imageSelected:false,
    imageURI:false,
  }
  render() {
    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style = {{backgroundColor:'#f9264f', width:width, height:height*0.01}}/>
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
            {'Upload a profile photo'}
          </Text>

          <TouchableHighlight 
          onPress={()=>this.getImage()} 
          // style = {this.isNameValid() ? styles.continueButton : styles.enterValidButton} 
          underlayColor="rgba(255,255,255,0.1)"
          // disabled = {!this.isNameValid()}
          >

            <Image source={this.state.imageURI ? {uri:this.state.imageURI} : require('./../icons/ProfileFinal.png')} 
            style={{marginTop: 40, width: width * 0.3, height: width*0.3, borderRadius:width*0.15}}/>

          </TouchableHighlight>

        </View>
            
        <KeyboardAvoidingView behavior = 'position'>
          <TouchableHighlight 
            onPress={()=>this.createUser()} 
            style = {this.state.imageSelected ? styles.continueButton : styles.enterValidButton} 
            underlayColor="rgba(255,255,255,0.1)"
            disabled = {!this.state.imageSelected}
          >
            <View style = {styles.tpSection}>
              <Text style={[styles.timeplaceText, !this.state.imageSelected ? {color:'#a8a8a8'}:{}]}>
                {this.state.imageSelected ? "Done!" : "Select a Profile Picture"}
              </Text>
             </View>
          </TouchableHighlight>
        </KeyboardAvoidingView>

      </View>
    )
  }


  isNameValid(){
    return true;
  }

  createUser(){
    firebase.analytics().logEvent("user_created")
    let user = {}
    user.fullname = this.props.fullname;
    user.phonenumber = this.props.number;
    user.photoURL = this.state.imageURI;
    user.userid = this.props.userid;
    user.username = this.props.username;
    user.badges = 0;
    user.groups = [];
    //console.log(user);

    let addUser = {}
    addUser[user.userid] = user;
    let usersRef = firebase.database().ref("Users/");
    usersRef.update(addUser)

    let usedRef = firebase.database().ref("Used_IDs/");
    let addUsed = {};
    addUsed[user.userid] = user.userid;
    usedRef.update(addUsed);

    let usernameRef = firebase.database().ref("Usernames/");
    let addUsername = {};
    addUsername[user.username] = user.userid;
    usernameRef.update(addUsername);    

    
    let phoneNumberRef = firebase.database().ref("PhoneNumbers/");
    let addPhone = {};
    addPhone[user.phonenumber] = user.userid;
    phoneNumberRef.update(addPhone);

    this.props.onLogin("asdf","asdf");
  }

  uploadImage(uri, mime = 'application/octet-stream') {

    // //console.log(typeof(uri));
    // return new Promise((resolve, reject) => {
    //   const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    //   //console.log(uploadUri)
    //   // const uploadUri = uri;
    //   let uploadBlob = null

    //   const imageRef = firebase.storage().ref('images').child('image_001')

    //   fs.readFile(uploadUri, 'base64')
    //     .then((data) => {
    //       let blob =  Blob.build(data, { type: `${mime};BASE64` })
    //       //console.log(blob)
    //       return blob
    //     })
    //     .then((blob) => {
    //       uploadBlob = blob
    //       //console.log(uploadBlob)
    //       return imageRef.put(blob, { contentType: mime })
    //     })
    //     .then(() => {
    //       uploadBlob.close()
    //       return imageRef.getDownloadURL()
    //     })
    //     .then((url) => {
    //       resolve(url)
    //     })
    //     .catch((error) => {
    //       reject(error)
    //   })
    // })

    return new Promise((resolve,reject)=>{
      let dateString = "" + new Date().getTime();
      const imageRef = firebase.storage().ref('/'+this.props.userid + "/avatar" + dateString + ".png");
      imageRef.put(uri, { contentType: mime }).then(()=>{
        imageRef.getDownloadURL().then(url => this.setState({imageURI:url, imageSelected:true}));
      });
      resolve();
      
    })



  }

  getImage(){
    //console.log(ImagePicker)

    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        //console.log('User canceled image picker');
      }
      else if (response.error) {
        //console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        //console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // let source = { uri: response.uri };
        // this.setState({image_uri: response.uri})

        // You can also display the image_urie using data:
        // let image_uri = { uri: 'data:image/jpeg;base64,' + response.data };
      
      this.uploadImage(response.uri)
        .then((url)=>this.setState({imageSelected:true, imageURI:url}))
        .catch(error => console.log(error))
      }
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
    fontSize:20,
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
});