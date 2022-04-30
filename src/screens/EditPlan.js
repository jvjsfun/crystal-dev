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
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
// 
// import ModalPicker from 'react-native-modal-picker'
// import ModalDropdown from 'react-native-modal-dropdown';
// import { Icon } from 'react-native-elements'

// TODO: Do not allow editing past plans.
// TODO: Make text scrollable

import User from '../helper/User.js';
import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';
import Images from '../Images.js';
import RNCalendarEvents from 'react-native-calendar-events';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';


var {height, width} = Dimensions.get('window');
var unsubscribe = "";
export default class EditPlan extends Component {

  constructor() {
      super();

      this.state = {
          textInputValue: '',
          planName:'I want to...',
          groupName:'All Friends',
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames','previousScreen','planId','planDate','dateEpoch','location','returnKey','invitedGroupNames','timeType','timeString',],
          currentUser:{},
          friendInfo:[],
          nextAvailableTime: this._getRoundedDate(),
          groupName:'All Friends',
      }
  }

  componentWillMount(){
    this.props.navigation.state.params.previousScreen = "EditPlan";

    //This lets you goBack() popping out all the addedOn edit pages (Plan, DateTimePicker stack up)
    if(!this._navPropOrDefault('returnKey',false)){
      this.props.navigation.state.params.returnKey = this.props.navigation.state.key;
    }

    if(this._navPropOrDefault('timeType','specific') === 'specific' && this._navPropOrDefault('dateEpoch',new Date()) < this.state.nextAvailableTime){
       this.props.navigation.state.params.dateEpoch = false;
       this.props.navigation.state.params.dateName = "";
    }

    
  }

  componentDidMount(){
    this.initUser();
  }



  render() {

    const { navigate, goBack } = this.props.navigation;
    
    // //console.log(this.props);
    // //console.log('reached');
    
    



    return (
      <View style={styles.container}>   
        <StatusBar barStyle = "light-content"/>
        <View style = {{height:height*0.035}}/>
        <View>
          <TouchableHighlight onPress = {()=>{firebase.analytics().logEvent("cancel_edit");goBack(this._navPropOrDefault('returnKey',''))}} underlayColor="rgba(255,255,255,0.1)">
            <View style = {{flexDirection:'row', alignItems:'center'}}>
              <Image source = {require('./../icons/WhiteArrow.png')} style = {styles.backButton}/>
              <Text style = {styles.cancelEdit}>
                Cancel
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style = {{height:height*0.155}}/>
        

       

         <TouchableWithoutFeedback>
          <View style={[styles.submit,{marginTop:0}]} >
              <ScrollView keyboardShouldPersistTaps = {"always"} scrollEnabled = {this.shouldBeScrollable(this._navPropOrDefault('planName','I want to...'))} horizontal showsHorizontalScrollIndicator = {false} contentContainerStyle = {{alignItems:'center'}}>
                <TouchableHighlight style = {{width: this.getTouchableWidth(this._navPropOrDefault('planName','I want to...'))}} underlayColor="rgba(255,255,255,0.95)" onPress = {()=>navigate('Plan',this._passNavParameters())}>
                  <Text numberOfLines = {1} style={styles.submitText, (this.props.navigation.state.params && this.props.navigation.state.params.planName) ? styles.submitTextOverride : styles.submitText}>
                    {this._navPropOrDefault('planName','I want to...')}
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
          <TouchableHighlight
            style={styles.timeplace}
            onPress={() => navigate('DateTimePicker',this._passNavParameters())}
            underlayColor="rgba(255,255,255,0.1)">
            <Text numberOfLines = {1} style={[styles.timeplaceText, {fontWeight:'bold'}]}>
              {this._navPropOrDefault('dateName',this._getDefaultDateString())}
            </Text>
          </TouchableHighlight>
        
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
                onPress={() => navigate('LocationPicker',this._passNavParameters())}
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
            Edit Plan
          </Text>
        </TouchableHighlight>

      </View>
    );
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
    // if(plan.dateEpoch === ) Only let you update plan if something has changed.
    return this._navPropOrDefault('planName',false);
  }

  _getPlan(){
    plan = {};
    let date = this.state.nextAvailableTime;
    plan.dateEpoch = this._navPropOrDefault('dateEpoch', date.getTime())
    plan.dateCreated = new Date().getTime();
    plan.planName = this._navPropOrDefault('planName',false);
    plan.location = this._navPropOrDefault('location', '');
    // plan.groupName = this._navPropOrDefault('groupName', 'All Friends');
    plan.planId = this._navPropOrDefault('planId',false);
    plan.timeString = "";
    plan.timeType = this._navPropOrDefault('timeType','specific');
    if(this._navPropOrDefault('timeType',false) === "vague"){
      plan.timeString = this._navPropOrDefault('timeString','');
    }
    // if(plan.groupName === 'All Friends'){
    //   let user = this.state.currentUser;
    //   if(user.currentFriends)
    //     plan.invitedFriends = Object.values(user.currentFriends);
    // }
    // else{
    //   plan.invitedFriends = this._navPropOrDefault('invitedFriends', []);  
    // }
    
    plan.host = this.state.currentUser.userid; 
    plan.hostName = this.state.currentUser.fullname;
    plan.photoURL = this.state.currentUser.photoURL;
    return plan;
  }

  _makePlan(){
    firebase.analytics().logEvent("plan_edited");
    let plan = this._getPlan();
    // if(plan.groupName === "All Friends"){
    //   let userid =  firebase.auth().currentUser.uid;
    
    //   firebase.database().ref('Users/' + userid).once('value').then((snapshot) => { 
    //     let user = snapshot.val();
    //     if(user.currentFriends)
    //       plan.invitedFriends = Object.values(user.currentFriends);
    //     this._editPlan(plan);
    //   });
    // }
    // else{
    this._editPlan(plan);  
    // }
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

  _editPlan(plan){
    const { navigate, goBack } = this.props.navigation;
    let database = firebase.database();
    let planRef = database.ref('Plans/'+plan.planId);
    console.log(plan);
    planRef.update(plan);
    let locationRef = planRef.child('location');
    locationRef.set(plan.location);

    // this._inviteFriends(plan.invitedFriends, plan.planId);

    let planDate = new Date(plan.dateEpoch);
    let startString = planDate.toISOString();
    planDate.setHours(planDate.getHours() + 1);

    let endString = planDate.toISOString();

    let calendarRef = database.ref('Users/' + plan.host + '/calendarEvents/');
    
    //TODO: Update calendar event
    let calendarId = this.state.currentUser.calendarEvents[plan.planId];
    RNCalendarEvents.saveEvent(plan.planName, {
      id:calendarId,
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




    goBack(this._navPropOrDefault('returnKey',''));
  }

  _getCurrentDay(){
    let currentDate = new Date();
    let newDate = new Date(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());
    return newDate;
  }


  printState(){
    //console.log(this.state);
    //console.log(this.props.navigation.state.params);
    //console.log(this._navPropOrDefault('friendInfo',''));
  }

  initUser(){
    this.refreshCurrentUserData();

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


  refreshCurrentUserData(){ //For now, everything dealing with networking will have to use response functions, kinda fuck this noise but w/e. Redux might be the solution.
    // //console.log("state in getCurrentUserData: ", this.state);
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
      // console.log(currentFriends);
      // else{
      //   this.props.navigation.state.params['invitedFriends'] = this._navPropOrDefault('invitedFriends',currentFriends);
      // }


      if(currentFriends){
        for(let friend of Object.values(currentFriends)){
          firebase.database().ref('Users/' + friend).once('value').then((snapshot) => {

            var userData = snapshot.val();
            //console.log(userData);
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
      }
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



}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9264f',
    // alignItems: 'center',
    justifyContent: 'flex-start',
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
    borderRadius:14,
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
    borderRadius:14,
    borderWidth: 2,
    borderColor: '#00B0F0'
  },
  planitText:{
      color:'#fff',
      textAlign:'center',
      fontSize:height*0.046,
      fontWeight:'bold'
  },
  backButton:
  { 
    height:height*0.0525,
    width:height*0.0525,
    marginRight:10,
    marginLeft:10,
    alignSelf:'flex-start'
  },
  cancelEdit:{
    color:'#fff',
    fontSize:height*0.035,
  }
});