import React, { Component } from 'react';
import {
  TabView,
  TabBarBottom,
  DrawerNavigator,
  StackNavigator,
  TabNavigator
} from 'react-navigation';

import {
  Alert

} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Home from '../tabs/Home';
//import Settings from '../tabs/Settings';

import ProfileTab from '../tabs/ProfileTab';

import AddedMe from '../screens/AddedMe';
import AddFriends from '../screens/AddFriends';
import MyFriends from '../screens/MyFriends';
import Settings from '../screens/Settings';
import Events from '../tabs/Events'
import Plan from '../screens/Plan'
import DateTimePicker from '../screens/DateTimePicker'
import MainMenu from '../screens/MainMenu'
import Login from '../screens/Login'
import Loading from '../screens/Loading'
import LoggedInNavigator from '../screens/LoggedInNavigator'
import firebase from 'react-native-firebase';
import CreateUsername from '../screens/CreateUsername';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

var renderCount = 0;
var messageHandlerCreated = false;
export default class HandleLogin extends Component {

  state = {
    isLoggedIn: false,
    name: '',
    facebookID:'',
    loading:true,
    eventID:false,
    navigate:false,
    newNotification:false,
    notification:{},
    tabsRenderedCount : 0,
    messageHandlerCreated:false,
    notificationBlock:false,
  }

  componentDidMount() {

    firebase.analytics().setAnalyticsCollectionEnabled(true);


    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
    
      if (user) {
       


        FCM.getInitialNotification().then(notification => {
          //console.log(notification);

          //TODO: Test with ChatPage
          if(!notification.navigate){

          }
          else{
            this.setState({notification:notification,newNotification:true, navigate:notification.navigate, planId: notification.planId});
          }


          // Alert.alert(
          //   'This opened the app!',
          //   notification.navigate,
          //   [
          //     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          //     {text: 'OK', onPress: () => console.log('OK Pressed')},
          //   ],
          //   { cancelable: false }
          // )
        });
        //console.log(user)
        // this.setState({ loading: false, isLoggedIn: true });
        firebase.database().ref('Used_IDs/' + user._user.uid).once('value').then((snapshot) => {
          var userData = snapshot.val();
          if(userData){
            this.setState({ loading: false, isLoggedIn: true });
          }
          else{
            this.setState({loading:false, isLoggedIn:false})
          }
        });
        
      } else {
        //console.log("NOT")
        this.setState({ loading: false, isLoggedIn: false });
      }
    });

    
  }

  render() {
    // //console.log("propsInHandleLogin: ",this.props);
    // //console.log("stateInHandleLogin: ", this.state);
    if(this.state.loading){
    
      return <Loading/>
    }
    if (this.state.isLoggedIn) {
        return <LoggedInNavigator 
          onLogoutPress={() => this.setState({isLoggedIn: false})}
          name={this.state.name}
          facebookID={this.state.facebookID}
          newNotification = {this.state.newNotification}
          notificationData = {{
            navigate:this.state.navigate,
            eventID:this.state.eventID,
          }}
          notification = {this.state.notification}
          consumeNotification = {()=>this.setState({newNotification:false})}
          tabRendered = {()=>this.tabRendered()}
          messageHandlerCreated={()=>this.messageHandlerCreated()}
          getNotificationBlock = {()=>this.getNotificationBlock()}
          chatEntered = {(planId)=>this.chatEntered(planId)}
          chatLeft = {()=>this.chatLeft()}


        />;
    }
    else 
      return <Login 
          onLogin={(name, facebookID) => this.setState({isLoggedIn: true, loading:false, name:name, facebookID: facebookID})}
      />;
  }


  messageHandlerCreated(){
    if(messageHandlerCreated || this.state.messageHandlerCreated){
      return true;
    }
    else{
      messageHandlerCreated = true;
      this.setState({messageHandlerCreated:true});
      return false;
    }
  }

  tabRendered(){
    // this.setState({tabsRenderedCount:this.state.tabsRenderedCount+1});
    // console.log(this.state.tabsRenderedCount);
    if(renderCount === 3){
      renderCount = 0;
    } 
    return ++renderCount;
  }

  chatEntered(planId){
    this.setState({notificationBlock:planId});
    // console.log("Chat entered: " + planId);
  }

  chatLeft(){
    console.log("chat left");
    this.setState({notificationBlock:false});
    // console.log("Chat left");
  }

  getNotificationBlock(){
    return this.state.notificationBlock;
  }



}