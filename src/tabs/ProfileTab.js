import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  StatusBar
} from 'react-native';

// import {Button as uButton} from 'react-native-elements';
// import { Button } from 'react-native-elements'
// 

//TODO:Add points




import { List, ListItem } from 'react-native-elements'
import firebase from 'react-native-firebase';;
import User from '../helper/User.js'
import RNFetchBlob from 'react-native-fetch-blob';



var ImagePicker = require('react-native-image-picker');

var AddedMeIcon = require('./../icons/AddedMe.png');
var AddedMeAlertIcon = require('./../icons/AddedMeAlert.png');
var AddFriendsIcon = require('./../icons/AddFriends.png');
var AddNearbyIcon = require('./../icons/AddNearby.png');
var MyFriendsIcon = require('./../icons/MyFriends.png');


const list = [
  {
    title: 'Added Me',
    icon: AddedMeIcon,
    type: 'ionicon',
    navigate:'AddedMe',
  },
  {
    title: 'Add Friends',
    icon: AddFriendsIcon,
    type: 'ionicon',
    navigate:'AddFriends',
  },
  {
    title: 'Add Nearby',
    icon: AddNearbyIcon,
    type: 'evilicon',
    navigate:'AddNearby',
  },
  {
    title: 'My Friends & Groups',
    icon: MyFriendsIcon,
    type: 'ionicon',
    navigate:'MyFriends'
  },
  
]

var {height, width} = Dimensions.get('window');

export default class ProfileTab extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  }

  constructor() {
      super();

      this.state = {
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames'],
          currentUser:{
            friendRequests:{},
          },
          
      }
  }

  componentWillMount(){
    //console.log("profile tab mounted");
    this.initCurrentUser();
  }

  componentWillUnmount(){
    // if(firebase.auth().currentUser){
      let friendRequestRef = firebase.database().ref("Users/"+this.state.currentUser.userid+"/friendRequests");
      friendRequestRef.off("child_added");
      friendRequestRef.off("child_removed");
    // }
  }

    

  componentDidMount(){
    // StatusBar.setBarStyle('light-content');

    let friendRequestRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/friendRequests");
    friendRequestRef.on("child_added", (snapshot) => {
      this.initCurrentUser();
    });
    friendRequestRef.on("child_removed", (snapshot) => {
      this.initCurrentUser();
    });
    
    if(this.props.screenProps.newNotification === true && this.props.screenProps.tabRendered() === 3){
      this.props.screenProps.consumeNotification();
      let notification = this.props.screenProps.notification;
      if(!notification){
        return;
      }
      if(notification.navigate){
        if(notification.navigate === "ChatPage"){
          this.props.screenProps.chatEntered(notification.planId);
          setTimeout(()=>navigate(notification.navigate, {planId: notification.planId, planName:notification.planName, dateEpoch:parseInt(notification.dateEpoch), location:notification.location, timeType:notification.timeType, timeString:notification.timeString, chatLeft: ()=>this.props.screenProps.chatLeft()}) );  
        }
        else{
          setTimeout(()=>navigate(notification.navigate));
        }
      }
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    // StatusBar.setBarStyle('dark-content');

    /*
  <Image backgroundColor = "rgba(255,255,255,0.15)" style = {{height:height/16, width:height/16, marginTop:height*0.01}}  source = {require('./../icons/RedCrown.png')}/>
 <View style = {styles.absoluteColumn}>

            <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.getImage()}>
              <Image  source={this.state.currentUser ? {uri:this.state.currentUser.photoURL, cache : "force-cache"} : require('./../icons/ProfileFinal.png')} 
              style={{width: height*0.16, height: height*0.16, borderRadius:height*0.08}}/>
            </TouchableHighlight>
          
</View>

    */
    
    return (
    
      <View style={styles.container}>
        <StatusBar barStyle = "light-content"/>
        <View style = {[styles.row, {backgroundColor:'#f9264f'}]}>
          <View style = {{flex:1,flexDirection:'row'}}>
           <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>navigate('Settings')}>
              <Image source = {require('./../icons/Settings.png')} style = {styles.settingsButton}  />
            </TouchableHighlight>
          </View>
          <Text style = {styles.header}>
            My Profile
          </Text>
          <View style = {{flex:1,flexDirection:'row'}}/>
        </View>
        <View style = {styles.divider}>

        </View>
        <View style = {styles.profile}>
         
            <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.getImage()}>
              <Image  source={this.state.currentUser ? {uri:this.state.currentUser.photoURL, cache : "force-cache"} : require('./../icons/ProfileFinal.png')} 
              style={{width: height*0.16, height: height*0.16, borderRadius:height*0.08, marginTop:24}}/>
            </TouchableHighlight>

          <Text numberOfLines = {1} style = {styles.profileText} > 
            {this.state.currentUser ? this.state.currentUser.fullname : "Full name"}
          </Text>
          <Text numberOfLines = {1} style = {styles.usernameText} > 
            {this.state.currentUser ? this.state.currentUser.username : "Username"}
          </Text>

        </View>
        <View>
          <ListItem
            
            title={"Added Me"}
            titleStyle = {{color:'#7f7f7f',fontWeight:'bold', fontSize:height*0.03}}
            leftIcon={
              //FIX THIS HACKY BULLSHIT
              <Image
                source = {this.getIconSource(list[0])}
                style = {{height:height*0.05, width: height*0.05, marginRight:12, marginLeft:5}}
            />}
            onPress={
              ()=>{
                firebase.analytics().logEvent("added_me_pressed")
                navigate(list[0].navigate,{currentUser:this.state.currentUser})
              }
            }
            hideChevron
            containerStyle = {[styles.listItem,{borderTopWidth:1}]}
          />
          <ListItem
            
            title={"Add Friends"}
            titleStyle = {{color:'#7f7f7f',fontWeight:'bold', fontSize:height*0.03}}
            leftIcon={
              //FIX THIS HACKY BULLSHIT
              <Image
                source = {this.getIconSource(list[1])}
                style = {{height:height*0.05, width: height*0.05, marginRight:12, marginLeft:5}}
            />}
            onPress={
              ()=>{
                firebase.analytics().logEvent("add_friends_pressed")
                navigate(list[1].navigate,{currentUser:this.state.currentUser})
              }
            }
            hideChevron
            containerStyle = {[styles.listItem]}
          />
          <ListItem
            
            title={"Add Nearby"}
            titleStyle = {{color:'#7f7f7f',fontWeight:'bold', fontSize:height*0.03}}
            leftIcon={
              //FIX THIS HACKY BULLSHIT
              <Image
                source = {this.getIconSource(list[2])}
                style = {{height:height*0.05, width: height*0.05, marginRight:12, marginLeft:5}}
            />}
            onPress={
              ()=>{
                firebase.analytics().logEvent("add_nearby_pressed")
                navigate(list[2].navigate,{currentUser:this.state.currentUser})
              }
            }
            hideChevron
            containerStyle = {[styles.listItem]}
          />
          <ListItem
            
            title={"My Friends & Groups"}
            titleStyle = {{color:'#7f7f7f',fontWeight:'bold', fontSize:height*0.03}}
            leftIcon={
              //FIX THIS HACKY BULLSHIT
              <Image
                source = {this.getIconSource(list[3])}
                style = {{height:height*0.05, width: height*0.05, marginRight:12, marginLeft:5}}
            />}
            onPress={
              ()=>{
                firebase.analytics().logEvent("my_friends_pressed")
                navigate(list[3].navigate,{currentUser:this.state.currentUser})
              }
            }
            hideChevron
            containerStyle = {[styles.listItem,{borderBottomWidth:0}]}
          />
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



  initCurrentUser(){

    this.refreshCurrentUserData();

  }

  getIconSource(item){
    // console.log(item.title);
    // console.log(this.state.currentUser.friendRequests);
    if(item.title !== 'Added Me'){
      return item.icon;
    }
    if(this.state.currentUser.friendRequests && Object.values(this.state.currentUser.friendRequests).length > 0)
      return AddedMeAlertIcon;
    else{
      return AddedMeIcon;
    }
    // item.title === 'Added Me' && this.state.currentUser.friendRequests && Object.values(this.state.currentUser.friendRequests).length > 0 ? AddedMeAlertIcon : item.icon
}

  refreshCurrentUserData(){
    //console.log("state in getCurrentUserData: ", this.state);
    // let userid =  '6BWdYou3bCcd6l28eb1iMuW6J9C3';//Switch to this shit when done testing: 
    let userid = firebase.auth().currentUser.uid;
    //console.log("current uid: " + userid)
    firebase.database().ref('Users/' + userid).once('value').then((snapshot) => {
      //console.log("state in firebase promise: ", this.state);

      var userData = snapshot.val();
      let currentUser = userData;

      let state = this.state;
      state.currentUser = currentUser;
      this.setState(state);

      if(!this.props.navigation.state.params){
       this.props.navigation.state.params = {};
      }

      this.props.navigation.state.params['currentUser'] = currentUser;
      this.props.screenProps.currentUser = currentUser;

      //Now update the info about current friends
      let  currentFriends = currentUser.currentFriends;
      if(!currentFriends){
        return;
      }
      for(let friend of currentFriends){
        firebase.database().ref('Users/' + friend).once('value').then((snapshot) => {
        var userData = snapshot.val();
          let state = this.state;
          let friendUser = new User(userData.fullname,userData.username,userData.email,userData.phonenumber, userData.userid, userData.photoURL, userData.currentFriends);   
          if(!state.friendInfo){
            state.friendInfo = [];
          }
          state.friendInfo.push(friendUser);
          this.setState(state);
          this.props.navigation.state.params.friendInfo = state.friendInfo;
        });
      }

      //console.log(this.state);
      //console.log(this.props.navigation.state.params.currentUser);

      
    });

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

    uploadImage(uri, mime = 'application/octet-stream') {


      return new Promise((resolve,reject)=>{
        let dateString = "" + new Date().getTime();
        let userid = firebase.auth().currentUser.uid;
        const imageRef = firebase.storage().ref('/'+userid + "/avatar" + dateString + ".png");
        imageRef.put(uri, { contentType: mime }).then(()=>{

          imageRef.getDownloadURL().then(url => {
            let currentUser = this.state.currentUser;
            currentUser.photoURL = url;
            this.setState({currentUser:currentUser});
            
            let userRef = firebase.database().ref('Users/' + userid);
            userRef.update({
              photoURL:url,
            });
          });
        });
        resolve();
        
      })



  }

  getImage(){
    //console.log(ImagePicker)
    let options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      quality:0.035,
      // takePhotoButtonTitle:null,
    };
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
    justifyContent: 'flex-end',
  },

  divider:{
    borderBottomColor:'#e4e4e4',
    borderBottomWidth:1,
  },

  profile: {
    flex:1,
    backgroundColor: '#fff',
    justifyContent:'flex-start',
    height: height/3,
    alignItems:'center',
  },


  profileText: {
    fontSize: height*0.033,
    marginTop:  height*0.02,
    marginBottom: 0,
    textAlign: 'center',
    justifyContent: 'center',
    color:'#404047',
    fontWeight:'bold',
  },

  usernameText:{
    fontSize: height*0.027,
    marginTop:  0,
    marginBottom: 0,
    textAlign: 'center',
    justifyContent: 'center',
    color:'#7f7f7f'
  },


  header: {
    fontSize: height*0.031,
    marginTop:  30,
    marginBottom: 20,
    textAlign: 'center',
    justifyContent: 'center',
    color:'white',
    fontWeight:'bold',
  },



  fullWidthButton: {
    backgroundColor: 'red',
    height:170,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  listItem: {
    height:height*.121,
    justifyContent:'center',
    borderColor:'#e4e4e4',
    borderBottomColor:'#e4e4e4',
    backgroundColor:'#fff',
    borderBottomWidth:1
  },

  row:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',
    width:width,
    height:height*0.12,

  },
  testButton:{

    alignSelf:'stretch',
  },
  settingsButton:
  { 
    
    marginTop:10,
    height:height*0.036,
    width:height*0.036,
    marginLeft:15,
    alignSelf:'flex-start'
  },
  absoluteColumn:{
    position:'absolute',
    top:height*0.05,

  }

});