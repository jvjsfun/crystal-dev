import React, { Component } from 'react';
import {
  // Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions,
  Alert,
  Image,
  StatusBar,
  StatusBarStyle,
  AppState,
  PushNotificationIOS,
  ScrollView,
  TouchableWithoutFeedback,
  PanResponder,
  TouchableOpacity
} from 'react-native';
// 
// import ModalPicker from 'react-native-modal-picker'
// import ModalDropdown from 'react-native-modal-dropdown';
// import { Icon } from 'react-native-elements'

import User from '../helper/User.js';
import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';
import Images from '../Images.js';
import RNCalendarEvents from 'react-native-calendar-events';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
// import RNCalendarEvents from 'react-native-calendar-events';

//TODO: Make it work based on a group system.
/*
  Separate page
*/
//TODO: make sure navparameters are the same and get passed
//TODO: test all subscriptions / unsubscriptions.
//TODO: EVENT ANALYTICS


/*
Schema for badges:
Users/[User]/badges = number of badges
Notification has badge of badges + 1

On componentDidMount, clear badges
*/


/*
  UPDATE:
    calendarHeight = 280
*/


//TODO BEFORE RELEASE:
/* 
*/

//TODO:
/*
  CONTACTS FOR ADDEDME
  Notification for delete
  Click on notification removes calendar event.
  MUTING WHEN DESELECTING ALL FRIENDS
*/

//REFACTOR
/*
  Date Object
  User Object -- Networking included
  Networking Object
  StyleSheets  
  Enums
*/


var {height, width} = Dimensions.get('window');
var unsubscribe = "";
export default class Home extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  }
  constructor() {
      super();

      this.state = {
          textInputValue: '',
          planName:'I want to...',
          groupName:'All Friends',
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames','invitedGroupNames','invitedGroups','selectionType'],
          currentUser:{},
          friendInfo:[],
          nextAvailableTime: this._getRoundedDate(),
          appState:"background",
          loaded:false,

      }


  }

  componentWillMount(){
    const { navigate } = this.props.navigation;

    // 
    

    // console.log(RNCalendarEvents);

    FCM.requestPermissions();

    RNCalendarEvents.authorizeEventStore()
    .then(status => {
      // handle status
      // console.log(status);
    })
    .catch(error => {
     // handle error
      // console.warn(error);
    });
  }

  // generatePhoneTable(){
  //   firebase.database().ref('Users/').once('value').then(snapshot =>{
  //     let users = snapshot.val();
  //     for(let user of Object.values(users)){
  //       this.addPhoneToTable(user.phonenumber, user.userid);
  //     }
  //   });
  // }

  // addPhoneToTable(phonenumber, userid){
  //   if(!phonenumber || !userid){
  //     console.log(userid);
  //   }

  //   let phoneRef = firebase.database().ref('PhoneNumbers/');
  //   let addPhone = {};
  //   addPhone[phonenumber] = userid;
  //   phoneRef.update(addPhone);
    
  // }

  // countUsersVsPhones(){
  //   firebase.database().ref('Users/').once('value').then(snapshot =>{
  //     let users = snapshot.val();
  //     firebase.database().ref('PhoneNumbers/').once('value').then(snapshot2 =>{
  //       let numbers = snapshot2.val();
  //       console.log(Object.values(users).length)
  //       console.log(Object.values(numbers).length)
  //     });      
  //   });    
  // }


  componentDidMount(){
    // this.generatePhoneTable();
    // this.countUsersVsPhones();

    this.props.screenProps.chatLeft();
    firebase.analytics().setAnalyticsCollectionEnabled(true);
    // let friendsRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/currentFriends");
    // friendsRef.on("child_added", (snapshot) => {
    //   if(this.state.loaded)
    //     this.initUser();
    // });

    this.resetBadges();


    AppState.addEventListener('change', this._handleAppStateChange);
    this.initUser();
    // it will crash if you open more than one onMessage
    FCM.subscribeToTopic(firebase.auth().currentUser.uid);
    // FCM.subscribeToTopic("josh");


    FCM.getFCMToken().then(token => {
      // console.log(token)
      // store fcm token in your server
    });
    
    const { navigate } = this.props.navigation;
    if(!this.props.screenProps.messageHandlerCreated()){
      this.notificationListener = FCM.on(FCMEvent.Notification, async (notification) => {
            // optional, do some component related stuff
        if(notification.opened_from_tray){
          // console.log(notification);

          // console.log(notification);  
          if(notification.navigate){
            if(notification.navigate === "ChatPage"){
              this.props.screenProps.chatEntered(notification.planId);
              navigate(notification.navigate, {planId: notification.planId, planName:notification.planName, dateEpoch:parseInt(notification.dateEpoch), location:notification.location, timeType:notification.timeType, timeString:notification.timeString, chatLeft:()=>this.props.screenProps.chatLeft()} );  
            }
            else{
              navigate(notification.navigate);
            }
          }
        }
        else if(!notification.manual){
          // console.log(notification);
          if(!notification.show_in_foreground){


            if(notification.sentUserid !== firebase.auth().currentUser.uid){

              //If the screen is on the relevant chatpage, don't display a notification.
              if(notification.navigate === "ChatPage" && notification.planId === this.props.screenProps.getNotificationBlock()){
                return;
              }

              let navigate = "";
              if(notification.navigate){
                navigate = notification.navigate;
              }

              let planId = "";
              if(notification.planId){
                planId = notification.planId;
              }

              let planName = "";
              if(notification.planName){
                planName = notification.planName;
              }

              let dateEpoch = "";
              if(notification.dateEpoch){
                dateEpoch = notification.dateEpoch;
              }

              let location = "";
              if(notification.location){
                location = notification.location;
              }

              let sound = "";
              if(notification.aps.sound){
                sound = notification.aps.sound;
              }

              FCM.presentLocalNotification({
                body: notification.aps.alert,                    // as FCM payload (required)
                sound: sound,                                   // as FCM payload
                priority: "high",                                   // as FCM payload
                wake_screen: true,                                  // Android only, wake up screen when notification arrives
                manual:true,
                navigate:navigate,
                planId:planId,
                planName:planName, 
                dateEpoch:dateEpoch, 
                location:location,

                show_in_foreground:true,                                  // notification when app is in foreground (local & remote)
              });
            }
          }
          
        //   FCM.presentLocalNotification({
        //     // id: "UNIQ_ID_STRING",                               // (optional for instant notification)
        //     title: "My Notification Title",                     // as FCM payload
        //     body: "My Notification Message",                    // as FCM payload (required)
        //     sound: "default",                                   // as FCM payload
        //     priority: "high",                                   // as FCM payload
        //     icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
        //     wake_screen: true,                                  // Android only, wake up screen when notification arrives
        //     manual:true,
        //     navigate:'AddedMe',

        //     show_in_foreground:true,                                  // notification when app is in foreground (local & remote)
        // });
          //Put stuff here for when the app is open and a notification comes in.
          //Facebook made messenger a separate app for this -_-
        }
        else{
          // console.log(notification);
        }
      });
    }

    
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
    // this.props.screenProps.tabRendered();

    // let date = new Date(1515385800000);
    

  }

  componentWillUnmount(){
    AppState.removeEventListener('change', this._handleAppStateChange);
    // let friendsRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/currentFriends");
    // friendsRef.off("child_added");
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.resetBadges();
      //TODO: Remove badges
    }
    this.setState({appState: nextAppState});
  }

  resetBadges(){
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
  }



  render() {

    const { navigate } = this.props.navigation;
    
    // //console.log(this.props);
    // //console.log('reached');
    
    


/*
         
          <TouchableHighlight
          style={[styles.submit,{marginTop:0}]}
          underlayColor="rgba(255,255,255,0.95)"
          onPress = {()=>navigate('Plan',this._passNavParameters())}
          >
          
            <Text numberOfLines = {1} style={styles.submitText, (this.props.navigation.state.params && this.props.navigation.state.params.planName) ? styles.submitTextOverride : styles.submitText}>
              {this._navPropOrDefault('planName','I want to...')}
            </Text>
          
          </TouchableHighlight>*/
    return (
      <View style={styles.container}>   
        <StatusBar barStyle = "light-content"/>
        <View style = {{height:height*0.153}}/>
          
         <TouchableWithoutFeedback>
            <View style={[styles.submit,{marginTop:0}]} >
                <ScrollView keyboardShouldPersistTaps = {"always"} scrollEnabled = {this.shouldBeScrollable(this._navPropOrDefault('planName','I want to...'))} horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{alignItems:'center'}}>
                  <TouchableHighlight style = {{width: this.getTouchableWidth(this._navPropOrDefault('planName','I want to...'))}} underlayColor="rgba(255,255,255,0.95)" onPress = {()=>this.goToPlanName()}>
                    <Text numberOfLines = {1} style={styles.submitText, (this.props.navigation.state.params && this.props.navigation.state.params.planName) ? styles.submitTextOverride : styles.submitText}>
                      {this._navPropOrDefault('planName','I want to...')}
                    </Text>
                  </TouchableHighlight>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <View style={[styles.submit]} >
            <ScrollView keyboardShouldPersistTaps = {"always"} scrollEnabled = {this.shouldBeScrollable(this._navPropOrDefault('groupName',this.state.groupName) )} horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{alignItems:'center'}}>
              <TouchableHighlight

                style={{width:this.getTouchableWidth(this._navPropOrDefault('groupName',this.state.groupName)+'     ')}}
                onPress={() => this.goToAddFriends(this._navPropOrDefault('selectionType','default'))}
                underlayColor="rgba(255,255,255,0.95)"
                disabled = {false}
                >
                <Text numberOfLines = {1} style={styles.submitText}>
                  With
                  <Text numberOfLines = {1} style = {{fontWeight:'bold', color:'#f9264f', marginLeft:100}}>
                    {' '} { this._navPropOrDefault('groupName',this.state.groupName) }
                  </Text>
                </Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        <View style = {[styles.tpSection,{marginTop:height*0.06}]}>
          <Image
              source = {Images.time}
              style = {{height:height/21, width: height/21}}
          />        
          <ScrollView scrollEnabled = {false} keyboardShouldPersistTaps = {"always"} contentContainerStyle = {{alignItems:'center'}} horizontal>
            <TouchableHighlight
              style={[styles.timeplace, {width:this.getTouchableWidth(this._navPropOrDefault('dateName',''))}]}
              onPress={() => this.goToDate()}
              underlayColor="rgba(255,255,255,0.1)">
              <Text numberOfLines = {1} style={[styles.timeplaceText, {fontWeight:'bold'}]}>
                {this._navPropOrDefault('dateName',this._getDefaultDateString())}
              </Text>
            </TouchableHighlight> 
          </ScrollView>       
        </View>


        <TouchableWithoutFeedback>

          <View style = {[styles.tpSection,{marginBottom:height*0.06}]}>
            <Image
                source = {Images.location}
                style = {{height:height*0.05, width: height*0.05}}
            />
            <ScrollView keyboardShouldPersistTaps = {"always"} scrollEnabled = {this.shouldBeScrollable(this._navPropOrDefault('location','Where') )} horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{alignItems:'center'}}>
              <TouchableHighlight 
                style={[styles.timeplace, {width:this.getTouchableWidth(this._navPropOrDefault('location',''))}]}
                onPress={() => this.goToLocation()}
                underlayColor="rgba(255,255,255,0.1)">
                <Text numberOfLines = {1} style={styles.timeplaceText}>
                  {this._navPropOrDefault('location', 'Where')}
                </Text>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>


         <TouchableHighlight
          style={this._planCanBeMade()? styles.planitSelectable : styles.planit}
          disabled = {!this._planCanBeMade()}
          onPress={() => this._makePlan()}
          underlayColor="rgba(255,255,255,0.1)">
          <Text style={styles.planitText}>
            Plan it!
          </Text>
        </TouchableHighlight>

      </View>
    );
  }

  goToPlanName(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("what_pressed");
    navigate('Plan',this._passNavParameters())
  }

  goToAddFriends(selectionType){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("who_pressed");
    if(selectionType === 'individual'){
      navigate('WithFriends',this._passNavParameters())
    }
    else{
      navigate('SelectGroups',this._passNavParameters())
    }
  }

  goToDate(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("when_pressed");
    navigate('DateTimePicker',this._passNavParameters())
  }

  goToLocation(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("where_pressed");
    navigate('LocationPicker',this._passNavParameters())    
  }

  _getDefaultDateString(){
    let str = "Today, ";
    if(this.state.nextAvailableTime.getDate() != new Date().getDate()){
      str = "Tomorrow, ";
    }


    let hours = this.state.nextAvailableTime.getHours(); 
    let hoursString = "" + hours%12;
    if(hours === 0 || hours === 12){
      hoursString = "12";
    }


    return str + hoursString + ":" + (this.state.nextAvailableTime.getMinutes() < 10 ? "0" : "") + this.state.nextAvailableTime.getMinutes() + (this.state.nextAvailableTime.getHours() >= 12 ? ' PM' : ' AM');
  }

  _navPropOrDefault(propName,defaultName){
    return ((this.props.navigation.state.params && this.props.navigation.state.params[propName]) ? this.props.navigation.state.params[propName] : defaultName);
  }

  _passNavParameters(){
    let parameters = {};
    for (i in this.state.navParameters){
      let param = this.state.navParameters[i];
      if(param === "invitedFriends" && !this._navPropOrDefault('groupName',false) ){ //Hacky, fix in update
        parameters[param] = {}
      }
      else{      
        parameters[param] = this._navPropOrDefault(param,'');
      }
    }
    return parameters;
  }


  _getRoundedDate(){
    let date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    // date.setTime(date.getTime() + 1800000);
    if(date.getMinutes() <= 30){
      date.setMinutes(30);
    }
    else{
      date.setMinutes(0);
      date.setHours(date.getHours()+1);
    }
    return date;
  }

  _planCanBeMade(){
    return this._navPropOrDefault('planName',false);
  }

  getInvitedFriendsFromGroups(invitedGroups){
    // console.log(invitedGroups)
    // console.log(this.state.currentUser);
    let invitedFriends = {};
    let currentUser = this.state.currentUser;
    if(!invitedGroups){
      return {};
    }
    for(let group of Object.values(invitedGroups)){
      if(!currentUser.groups || !currentUser.groups[group] || !currentUser.groups[group].friendsInGroup){
        continue
      }
      for(let friend of Object.values(currentUser.groups[group].friendsInGroup)){
        invitedFriends[friend] = friend;
      }
    }
    // console.log(invitedFriends);
    return invitedFriends;
  }

  _getPlan(){
    plan = {};
    let date = this.state.nextAvailableTime;
    plan.dateEpoch = this._navPropOrDefault('dateEpoch', date.getTime())
    plan.dateCreated = new Date().getTime();
    plan.planName = this._navPropOrDefault('planName',false);
    plan.location = this._navPropOrDefault('location', '');
    plan.groupName = this._navPropOrDefault('groupName', 'All Friends');
    plan.invitedGroups = this._navPropOrDefault('invitedGroups',{})

    if(plan.groupName === 'All Friends'){
      let user = this.state.currentUser;
      if(user.currentFriends)
        plan.invitedFriends = user.currentFriends;
    }
    else{
      let selectionType = this._navPropOrDefault('selectionType', 'group'); 
      let invitedGroups = this._navPropOrDefault('invitedGroups', {}); 
      if(selectionType === 'group'){
        //Listener needed 
        plan.invitedFriends = this.getInvitedFriendsFromGroups(invitedGroups);
      }
      else if(selectionType === 'individual'){
        plan.invitedFriends = this._navPropOrDefault('invitedFriends', {});    
      }
      
    }
    
    plan.host = this.state.currentUser.userid; 
    plan.hostName = this.state.currentUser.fullname;
    plan.photoURL = this.state.currentUser.photoURL;
    return plan;
  }

  _makePlan(){
    firebase.analytics().logEvent("plan_created");
    let plan = this._getPlan();
    if(plan.groupName === "All Friends"){
      let userid =  firebase.auth().currentUser.uid;
    
      firebase.database().ref('Users/' + userid).once('value').then((snapshot) => { 
        let user = snapshot.val();
        if(user.currentFriends)
          plan.invitedFriends = user.currentFriends;
        this._uploadPlan(plan);
      });
    }
    else{
      this._uploadPlan(plan);  
    }
    
  }

  _uploadPlan(plan){
    let database = firebase.database();
    let planRef = database.ref('Plans/');



    let planAddedRef = planRef.push();
    plan.planId = planAddedRef.key;
    planAddedRef.set(plan);

    let userRef = database.ref('Users/' + plan.host+'/hosted/');
    let addPlan = {};
    addPlan[plan.planId] = plan.planId;
    userRef.update(addPlan)

    //Subscribe to notifications for plan
    FCM.subscribeToTopic(plan.planId);

    this._inviteFriends(plan.invitedFriends, plan.planId);

    let planDate = new Date(plan.dateEpoch);

    let startString = planDate.toISOString();

    planDate.setHours(planDate.getHours() + 1);

    let endString = planDate.toISOString();

    RNCalendarEvents.saveEvent(plan.planName, {
      location: plan.location,
      // notes: 'notes',
      startDate: startString,
      endDate: endString,
      alarms: [{
        date: -15
      },
      {
        date:0
      }

      ]
    })

    .then(id =>{
      let calendarRef = database.ref('Users/' + plan.host + '/calendarEvents/');
      let addCalendar = {};
      addCalendar[plan.planId] = id;
      calendarRef.update(addCalendar);
    })

    .catch(error => {
      console.log(error);
    });


    this._resetScreen();
  }

  _resetScreen(){
    // let state = this.state;
    // let navParams = this.props.navigation.state.params;
    // navParams = {};
    // state.textInputValue = '';
    // state.planName ='I want to...';
    // state.groupName = 'All Friends';
    // state.currentUser={};
    // state.friendInfo = [];


    this.props.navigation.state.params = {};
    let state = this.state;
    state = {
      textInputValue: '',
      planName:'I want to...',
      groupName:'All Friends',
      navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames','individuallyInvitedFriends'],
      currentUser:{},
      friendInfo:[],
      nextAvailableTime: this._getRoundedDate(),
      groupName:'All Friends',
    }
    this.setState(state);

    const { navigate } = this.props.navigation;
    //Reset to different tab
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'MainMenu'})
    //   ]
    // })

    

    // Promise.all([
    //   this.props.navigation.dispatch(resetAction)
    // ]).then(()=>{

    navigate('Events');

    // });

    


    
  }


  _inviteFriends(friends, planId){
    if(!friends || !planId){
      return;
    }
    let database = firebase.database();
    for (let userid of Object.values(friends)){
      let userPlansRef = database.ref('Users/'+userid+'/invited/');
      let addPlan = {};
      addPlan[planId] = planId;
      userPlansRef.update(addPlan);
    }
  }

  _getCurrentDay(){
    let currentDate = new Date();
    let newDate = new Date(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
    return newDate;
  }

  getTouchableWidth(string){
    let len = string.length;
    return Math.max( (width * (len / 30)), width);
    // return (width*(len/30))
  }

  shouldBeScrollable(string){
    let len = string.length;
    return  len / 30 >= 0.7;
  }



  printState(){
    //console.log(this.state);
    //console.log(this.props.navigation.state.params);
    //console.log(this._navPropOrDefault('friendInfo',''));
  }

  initUser(){
    this.refreshCurrentUserData();

  }


  refreshCurrentUserData(){ //For now, everything dealing with networking will have to use response functions, kinda fuck this noise but w/e. Redux might be the solution.
    // //console.log("state in getCurrentUserData: ", this.state);
    this.setState({loaded:false})
    let userid =  firebase.auth().currentUser.uid;
    // //console.log("current uid: " + userid)
    firebase.database().ref('Users/' + userid).once('value').then((snapshot) => {
      // //console.log("state in firebase promise: ", this.state);

      var userData = snapshot.val();
      let currentUser = userData;

      //TODO: Separate State and NavParams
      let state = this.state;
      state.currentUser = currentUser;
      this.setState(state);

      if(!this.props.navigation.state.params){
       this.props.navigation.state.params = {};
      }

      this.props.navigation.state.params['currentUser'] = currentUser;
      this.props.screenProps.currentUser = currentUser;

      //Now update the info about current friends
      let currentFriends = currentUser.currentFriends;
      if(state.groupName === 'All Friends'){
        // this.props.navigation.state.params['invitedFriends'] = currentFriends;  
      }

      if(currentFriends){
        for(let friend of Object.values(currentFriends)){
          firebase.database().ref('Users/' + friend).once('value').then((snapshot) => {
            var userData = snapshot.val();
            //console.log(userData);
            let state = this.state;
            let friendUser = userData;   
            if(!state.friendInfo){
              state.friendInfo = [];
            }
            state.friendInfo.push(friendUser);
            this.setState(state);
            this.props.navigation.state.params.friendInfo = state.friendInfo;
          });
        }
      }
    });
    this.setState({loaded:true})
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

  createPanResponder(){
    // this._panResponder = PanResponder.create({
    //   // Ask to be the responder:
    //   onStartShouldSetPanResponder: (evt, gestureState) => true,
    //   onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
    //   onMoveShouldSetPanResponder: (evt, gestureState) => false,
    //   onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    //   onPanResponderGrant: (evt, gestureState) => {
    //     // The gesture has started. Show visual feedback so the user knows
    //     // what is happening!
    //     // console.log(evt)
    //     // console.log(gestureState)
    //     // console.log("grant")
    //     // this._scrollView.scrollResponderHandleStartShouldSetResponder = () => false
    //     // gestureState.d{x,y} will be set to zero now
    //   },
    //   onPanResponderMove: (evt, gestureState) => {
    //     // The most recent move distance is gestureState.move{X,Y}
    //     // this._scrollView.scrollResponderHandleStartShouldSetResponder = () => true
    //     // return false;
    //     // console.log(evt)
    //     // console.log(gestureState)
    //     // console.log("move")
    //     console.log(gestureState.moveX - gestureState.x0);
    //     // this._scrollView.scrollTo({x:gestureState.x0 - gestureState.moveX , y:0, animated:false})
    //     // The accumulated gesture distance since becoming responder is
    //     // gestureState.d{x,y}
    //   },
    //   onPanResponderTerminationRequest: (evt, gestureState) => true  ,
    //   onPanResponderRelease: (evt, gestureState) => {
    //     // console.log(evt)
    //     // console.log(gestureState)
    //     // The user has released all touches while this view is the
    //     // responder. This typically means a gesture has succeeded
    //     console.log(gestureState);
    //     if(!gestureState.moveX)
    //       navigate('Plan',this._passNavParameters())
    //     else{
    //       this._scrollView.scrollTo({x:0})
    //     }
    //   },
    //   onPanResponderTerminate: (evt, gestureState) => {
    //     // Another component has become the responder, so this gesture
    //     // should be cancelle
    //     console.log("terminate")
    //   },
    //   onShouldBlockNativeResponder: (evt, gestureState) => {
    //     // Returns whether this component should block native components from becoming the JS
    //     // responder. Returns true by default. Is currently only supported on android.
    //     return true;
    //   },
    // });

  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9264f',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  tpSection: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:height*0.05,
    marginRight:20,
    marginTop:height*0.02,
    marginBottom:height*0.02,

  },
  tpIcon: {
      padding: 10,
  },
  header: {
    fontSize: 20,
    marginVertical: 20,
  },
  submit:{
    marginRight:height*0.035,
    marginLeft:height*0.035,
    marginTop:height*0.042,
    height:height*0.118,
    justifyContent:'center',
    backgroundColor:'#fff',
    borderRadius:7.5,
    borderWidth: 1,
    borderColor: '#fff'
  },
  submitText:{

      marginLeft:20,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:height*0.035
  },

  submitTextOverride:{
    color:'#f9264f',
    marginLeft:20,
    textAlign:'left',
    fontSize:height*0.035,
    fontWeight:'bold',

  },
  timeplace:{
    marginRight:10,
    marginLeft:10,
    marginTop:0,
    height:height*0.04,
    backgroundColor:'#f9264f',

  },

  timeplaceText:{
    marginLeft:2,
    color:'#fff',
    textAlign:'left',
    fontSize:height*0.031,
  },

   planit:{
    marginRight:height*0.035,
    marginLeft:height*0.035,
    marginBottom:height*0.127,
    height:height*0.122,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f9264f',
    borderRadius:12,
    borderWidth: 2,
    borderColor: '#fff'
  },
  planitSelectable:{
    marginRight:height*0.035,
    marginLeft:height*0.035,
    marginBottom:height*0.127,
    height:height*0.122,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#00B0F0',
    borderRadius:12,
    borderWidth: 2,
    borderColor: '#00B0F0'
  },
  planitText:{
      color:'#fff',
      textAlign:'center',
      fontSize:height*0.046,
      fontWeight:'bold'
  },
});