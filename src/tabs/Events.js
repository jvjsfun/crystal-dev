import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  FlatList,
  Alert,
  Image,
  StatusBar
} from 'react-native';
import firebase from 'react-native-firebase';
import User from '../helper/User.js';
import Swipeout from 'react-native-swipeout';
import RNCalendarEvents from 'react-native-calendar-events';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import moment from 'moment';
var {height, width} = Dimensions.get('window');




export default class Events extends Component {
  
  //TODO: Dot to signify shit happening

  static navigationOptions = {
    gesturesEnabled: false
  }
  constructor() {
    super();

    this.state = {
      navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames','isPlanPast'],
      currentUser:{},
      text:"",
      filters:{},
      invited:{},
      hosted:{},
      joined:{},
      viewed:{},
      interested:{},
      formattedPlans:[],
      pastFound:false,
      past:{},
      refreshing:true,
      loaded:false,
      timeRefreshed:new Date(0),
    }
  }


  componentDidMount(){

    FCM.requestPermissions();

    RNCalendarEvents.authorizeEventStore()
    .then(status => {
      // handle status
    
    })
    .catch(error => {
     // handle error
    
    });
    
    
    this.initUser();
    this.createListeners();


    //This is a hacky, incredibly weird solution to navigating to a specific tab notification when the program starts.
    //Basically without this, if you just navigate, you are not guaranteed to go to the right tab.
    //With this, as weird as it is, it works.
    //If you find a better way, please mark it with a comment with the word HACKFIX in it, I would really appreciate it.
    const { navigate } = this.props.navigation;
    if(this.props.screenProps.newNotification === true && this.props.screenProps.tabRendered() === 3){
      this.props.screenProps.consumeNotification();
      let notification = this.props.screenProps.notification;

      if(notification && notification.navigate){
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

  componentWillUnmount(){
    // console.log("\n\n\nUNMOUNTING\n\n\n");
    this.removeListeners();
  }

  createListeners(){
    // console.log("\n\n\nMOUNTING\n\n\n");
  }

  removeListeners(){

  }

  render() {

    const { navigate } = this.props.navigation; 
    
    //You are probably going to want to start the front-end and back-end of this page from scratch.
    //It is done for the previous app design which had a far different structure.

    return (
      <View style={styles.container}>
        <StatusBar barStyle = "light-content"/>
        <View style = {[styles.row, {backgroundColor:'#f9264f'}]}>
          <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this._toggleFilter('past')}>
            <Image source = {this.state.filters.past ? require('./../icons/PastToggle1.png') : require('./../icons/PastToggle0.png') } style = {styles.headerButton}  />
          </TouchableHighlight>
          <View style = {{flexDirection:'row', flex:1}}/>
            <Text style = {styles.header}>
              What's Happening?
            </Text>
          <View style = {{flexDirection:'row', flex:1}}/>
          <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this._toggleFilter('going')}>
            <Image source = {this.state.filters.going ? require('./../icons/GoingToggle1.png') : require('./../icons/GoingToggle0.png')} style = {styles.headerButton}  />
          </TouchableHighlight>
        </View>

        <View style = {styles.divider}/>
        <View style = {styles.profile}>

        {//render list of users to chat with here
        }
        
        </View>
      </View>
    );
  }

  getPlanDateString(item){
    if(!item.timeType || item.timeType === 'specific'){
      return this.epochToString(item.dateEpoch);
    }
    else if(item.timeType === 'vague'){
      return this.epochToStringWithoutTime(item.dateEpoch) + item.timeString;
    }
  }

  getPlanNames(item){
    let hostName = item.hostName;
    if(hostName)
      hostName = item.hostName.split(' ')[0]
    else{
      console.log(item.planId);
    }
    return hostName + (item.going ? (" & " + Object.values(item.going).length + " other" + (Object.values(item.going).length > 1 ? "s":"")) : "")
  }

  getPlanPreface(item){
    if(!item.hostName){
      return;
    }

    if(item.planName in customPlanText){
      let nowOrLater = "Later";
      if(new Date().getTime() >= item.dateEpoch){
        nowOrLater = "Now";
      }
      return item.hostName.split(" ")[0] + " " + customPlanText[item.planName][nowOrLater];
    }
    else{
      return item.hostName.split(" ")[0] + " wants to: ";
    }
  }

  getPlanName(item){
    if(item.planName === "Chill" && new Date().getTime() >= item.dateEpoch){
      return "Chilling";
    }
    return item.planName;
  }


  renderNotification(tag){
    if(tag === "New"){
      return(
        <Image style = {styles.notification} source = {require('./../icons/New.png')}/>
      );
    }
    else{
      return(
        <View style = {styles.notification}/>
      );
    }
  }

  renderIcons(tag){
    
    if (tag === "Going"){
      return(
        <View style = {styles.flexColumn}>
          <Image style = {styles.icon} source = {require('./../icons/Going.png')}/>
          <Text style = {[styles.iconText, {color:'#00B0F0'}]}>
            Going
          </Text>
        </View>
      ); 
    }

    else if(tag === "Hosting"){
      return(
        <View style = {styles.flexColumn}>
          <Image style = {styles.icon} source = {require('./../icons/Hosting.png')}/>
          <Text style = {[styles.iconText, {color:'#f9264f'}]}>
            Hosting
          </Text>
        </View>
      );
    }

    else if(tag === "New"){
      return(
        <View style = {styles.flexColumn}>
          <Image style = {styles.icon} source = {require('./../icons/New.png')}/>
          <Text style = {[styles.iconText, {color:'#ffc000'}]}>
            New
          </Text>
        </View>
      );
    }

    else if(tag === "Interested"){
      return(
        <View style = {styles.flexColumn}>
          <Image style = {styles.icon} source = {require('./../icons/Interested.png')}/>
          <Text style = {[styles.iconText, {color:'#FF85FF'}]}>
            Interested
          </Text>
        </View>
      ); 
    }

    else{
      return(
        <View style = {styles.flexColumn}>
        <View style = {styles.icon}/>
        </View>
      );
    }
    
  }

  renderNoPlans(){
    // console.log(this.state.plansNotFound);
    if(this.state.plansNotFound && this.state.formattedPlans.length === 0){
      const { navigate } = this.props.navigation;
      return(
        <View style = {{marginTop: height*0.15,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
          <Image style = {styles.king} source = {require('./../icons/CryingKing.png')}/>
          <Text style = {{marginTop:15,fontSize:height*0.025, color:'#a6a6a6'}}>
            No one is hanging out right now!
          </Text>
          <TouchableHighlight underlayColor = "#00d1ff" onPress = {()=>navigate('Home')}style = {[styles.planitSelectable,{marginTop:15}]}>
            <Text style = {styles.planitText}>
              Make Your Own!
            </Text>
          </TouchableHighlight>
        </View>


      );
    }
  }

  getButtonNames(item){
    let buttons = [];
    if(item.status === 'host'){
      let button = {};
      button.text = "Delete";
      // button.color = "Red";
      button.backgroundColor = "#FF0000";
      button.onPress = () => this.showDeletePopup(item);
      buttons.push(button);
    }
    if(item.status === 'joined'){
      let button = {};
      button.text = "Leave";
      // button.color = "Red";
      button.backgroundColor = "#FF0000";
      button.onPress = () => this.showLeavePopup(item);
      buttons.push(button);
    }

    if(item.tag === 'Interested'){
      let button = {};
      button.text = "Leave";
      button.backgroundColor = "#FF0000";
      button.onPress = () => this.showUninterestPopup(item);
      buttons.push(button);
    }
    
    else if(item.status === 'invited'){
      let button = {};
      button.text = "Ignore";
      // button.color = "Red";
      button.backgroundColor = "#D3D3D3";
      button.onPress = () => this.ignorePlan(item);
      buttons.push(button);
    }

    



    return buttons;
  }

  showDeletePopup(item){
    firebase.analytics().logEvent("delete_popup");
    Alert.alert(
      'Delete Plan?',
      'Are you sure you want to delete this Plan?',
      [
        {text: 'Cancel', onPress: () => firebase.analytics().logEvent("cancel_delete"), style: 'cancel'},
        {text: 'Delete plan', onPress: ()=>this.deletePlan(item)},
      ],
    )

  }

  showLeavePopup(item){
    firebase.analytics().logEvent("leave_popup");
    Alert.alert(
      'Leave Plan?',
      'The Plan will still be available in My Plans.',
      [
        {text: 'Cancel', onPress: () => firebase.analytics().logEvent("cancel_leave"), style: 'cancel'},
        {text: 'Leave Plan', onPress: ()=>this.leavePlan(item)},
      ],
    )

  }

  showUninterestPopup(item){
    firebase.analytics().logEvent("uninterest_popup");
    Alert.alert(
      'Not Interested?',
      'The Plan will still be available in My Plans.',
      [
        {text: 'Cancel', onPress: () => firebase.analytics().logEvent("cancel_leave"), style: 'cancel'},
        {text: 'Not Interested', onPress: ()=>this.uninterestPlan(item)},
      ],
    )

  }


  deletePlan(item){
    firebase.analytics().logEvent("delete_plan");
    FCM.unsubscribeFromTopic(item.planId);
    // console.log(item)
    firebase.database().ref('Plans/' + item.planId).once('value').then((snapshot) => {
      let plan = snapshot.val();
      let addPlan = {};
      addPlan[item.planId] = plan;
      let deletedRef = firebase.database().ref('deletedPlans/');
      deletedRef.update(addPlan);
      let planRef = firebase.database().ref("Plans/"+item.planId);
      planRef.remove();
      let hostedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/hosted/"+item.planId);
      hostedRef.remove();

      this.refreshCurrentUserData();
      this.deleteCalendarEvent(item.planId);
    });
    //TODO: remove plan from everyone's calendar
  }

  leavePlan(item){
    firebase.analytics().logEvent("leave_plan");
    console.log(item.planId);
    FCM.unsubscribeFromTopic(item.planId);

    let joinedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/joined/" + item.planId);
    joinedRef.remove();

    let goingRef = firebase.database().ref("Plans/"+item.planId + "/going/"+firebase.auth().currentUser.uid);
    goingRef.remove();

    let invitedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/invited/");
    let addPlan = {};
    addPlan[item.planId] = item.planId;
    invitedRef.update(addPlan);

    this.refreshCurrentUserData();
    this.deleteCalendarEvent(item.planId);
  }

  uninterestPlan(item){
    firebase.analytics().logEvent("uninterest_plan");

    FCM.unsubscribeFromTopic(item.planId);

    let interestedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/interested/" + item.planId);
    interestedRef.remove();

    let interestedPlanRef = firebase.database().ref("Plans/"+item.planId + "/interested/"+firebase.auth().currentUser.uid);
    interestedPlanRef.remove();

    let invitedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/invited/");
    let addPlan = {};
    addPlan[item.planId] = item.planId;
    invitedRef.update(addPlan);

    this.refreshCurrentUserData();
  }

  deleteCalendarEvent(planId){
    firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/calendarEvents/'+planId).once('value').then((snapshot) => {
      let calendarEvent = snapshot.val();
      RNCalendarEvents.removeEvent(calendarEvent);
      let calendarRef = firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/calendarEvents/'+planId);
      calendarRef.remove();
    });
  }

  ignorePlan(item){
    firebase.analytics().logEvent("ignore_plan");
    // let addPlan = {};
    // addPlan[item.planId] = item.planId;
    // let pastRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/past/" );
    // pastRef.update(addPlan);
    let invitedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/invited/" + item.planId);
    invitedRef.remove();
    this.refreshCurrentUserData();
  }


  goToChat(item){
    let refreshFunction = this.refreshCurrentUserData.bind(this);
    firebase.analytics().logEvent("go_to_chat");
    if(item.tag === "New"){
      item.tag === "";
      let viewedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/viewed/");
      let addViewed = {};
      addViewed[item.planId] = item.planId;
      viewedRef.update(addViewed);
    }

    this.props.screenProps.chatEntered(item.planId);

    const { navigate } = this.props.navigation; 
    item.currentUser = this.state.currentUser;
    item.chatLeft = ()=>this.props.screenProps.chatLeft();
    item.dateName = this.getPlanDateString(item);
    // console.log(item.dateName);
    item.refresh = ()=>refreshFunction();
    navigate('ChatPage',item);
  }

  _toggleFilter(filterName){
    firebase.analytics().logEvent(filterName +"_toggled");
    let state = this.state;
    for(let key in state.filters){
      // console.log(key);
      // console.log(filterName);
      if(key !== filterName){
        state.filters[key] = false;
      }
    } 
    state.filters[filterName] = !state.filters[filterName];
    this.setState(state);
    this.refreshCurrentUserData();
  }

  _passNavParameters(){
    let parameters = {};
    for (i in this.state.navParameters){
      let param = this.state.navParameters[i];
      parameters[param] = this._navPropOrDefault(param,'');
    }
    return parameters;
  }

  _navPropOrDefault(propName,defaultName = {}){
    return ((this.props.navigation.state.params && this.props.navigation.state.params[propName]) ? this.props.navigation.state.params[propName] : defaultName);
  }


  //Refactor: Use this function for all (Home and elsewhere)
  epochToString(epoch){
    let eventDate = new Date(epoch)
    let today = new Date();

    let tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);

    let dateText = eventDate.toLocaleDateString() + ", ";
    if(eventDate.toLocaleDateString() === today.toLocaleDateString()){
      dateText = 'Today, '
    }
    else if(eventDate.toLocaleDateString() === tomorrow.toLocaleDateString()){
      dateText = 'Tomorrow, '
    }
    else if(eventDate.toLocaleDateString() === yesterday.toLocaleDateString()){
      dateText = 'Yesterday, '
    }
    else{
      return this.epochToMoment(epoch);
    }
    let hours = eventDate.getHours();
    let hoursString = "" + hours%12;
    if(hours === 0 || hours === 12){
      hoursString = "12";
    }
    dateText += hoursString + ":" + (eventDate.getMinutes() < 10 ? "0" : "") + eventDate.getMinutes() + (eventDate.getHours() >= 12 ? ' PM' : ' AM');
    return dateText
  }

  epochToMoment(epoch){
    let planMoment = moment(epoch);
    // console.log(planMoment.format("MMM Do"));
    return (planMoment.format("ddd, MMM D, h:mm A"));
  }

  epochToStringWithoutTime(epoch){
    let eventDate = new Date(epoch)
    let today = new Date();

    let tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);

    let dateText = eventDate.toLocaleDateString() + ", ";
    if(eventDate.toLocaleDateString() === today.toLocaleDateString()){
      dateText = 'Today, '
    }
    else if(eventDate.toLocaleDateString() === tomorrow.toLocaleDateString()){
      dateText = 'Tomorrow, '
    }
    else if(eventDate.toLocaleDateString() === yesterday.toLocaleDateString()){
      dateText = 'Yesterday, '
    }
    else{
      return this.epochToMomentWithoutTime(epoch);
    }
    return dateText
  }

  epochToMomentWithoutTime(epoch){
    let planMoment = moment(epoch);
    // console.log(planMoment.format("MMM Do"));
    return (planMoment.format("ddd, MMM D, "));
  }

  initUser(){
    // //console.log("state in initUser: ", this.state);
    // let lastUpdateDate = new Date().toISOString();
    this.refreshCurrentUserData();

  }


  refreshCurrentUserData(){ //For now, everything dealing with networking will have to use response functions, kinda fuck this noise but w/e. Redux might be the solution.
    // console.log("refreshing?");
    this.setState({loaded:false});
    // console.log("state in getCurrentUserData: ", this.state);
    // let userid =  '6BWdYou3bCcd6l28eb1iMuW6J9C3';//Switch to this shit when done testing: 
    // console.log("REFRESHING");
    let userid = firebase.auth().currentUser.uid;
    // //console.log("current uid: " + userid)
    firebase.database().ref('Users/' + userid).once('value').then((snapshot) => {
      // //console.log("state in firebase promise: ", this.state);

      var userData = snapshot.val();
      // let currentUser = new User(userData.fullname,userData.username,userData.email,userData.phonenumber, userData.userid, userData.photoURL, userData.currentFriends);
      let currentUser = userData;
      let state = this.state;
      state.currentUser = userData;
      if(!userData.invited && !userData.hosted && !userData.joined && !(this.state.filters.past && userData.past)){
      
        this.setState({plansNotFound:true});
      }
      else{
      
        this.setState({plansNotFound:false});
      }

      this.setState(state);

      

      if(!this.props.navigation.state.params){
       this.props.navigation.state.params = {};
      }

      this.props.navigation.state.params['currentUser'] = currentUser;
      this.props.screenProps.currentUser = currentUser;

      
      this.formatPlansForList();
      
    });
    this.setState({loaded:true});

  }

  isPlanPast(plan){
    let dayAfterPlanDate = plan.dateEpoch + 10800000;
    //console.log(dayAfterPlanDate);        
    //console.log(new Date().getTime());

    return (dayAfterPlanDate < new Date().getTime());
  }

  //TODO: This needs to be fixed to scale, see firebase query methods
  formatPlansForList(){
    //All this has been removed to not confuse as it is entirely different. 
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

  buttonRow:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    width:width,
    // height:height/,

    // backgroundColor:'black',
    flex:0

  },

  column:{
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent:'center',
    flex:0,
    width:width*0.6,
    // marginLeft:10,

  },

  flexColumn:{
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'flex-start',
    // flex:0,
    marginLeft:10,
    width:height*0.12,
    // marginRight:,

  },

  columnCenter:{
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'flex-start',
    flex:0,
    // marginLeft:10,

  },

  planNameText:
  {
    // fontWeight:'400', 
    fontSize:height*0.028,
    fontWeight:'bold',
    //previously 0.028 
    color:'#000',
  },

  planDetailsText:{ 
    fontSize:height*0.023, 
    color:'black',
    // fontWeight:'bold'
  },

  filterButton:{
    marginRight:2.5,
    marginLeft:2.5,
    marginTop:7.5,
    marginBottom:7.5,
    backgroundColor:'#fff',
    borderRadius:6,
    borderWidth: 1,
    borderColor: '#bfbfbf',
    paddingTop:5,
    paddingBottom:5,
    paddingRight:5,
    paddingLeft:5,
  },
  filterButtonText:{
    color:'#bfbfbf',
    fontSize:height*0.023,
  },
  filterButtonSelected:{
    marginRight:2.5,
    marginLeft:2.5,
    marginTop:7.5,
    marginBottom:7.5,
    backgroundColor:'#fd2744',
    borderRadius:6,
    borderWidth: 1,
    borderColor: '#fff',
    paddingTop:5,
    paddingBottom:5,
    paddingRight:5,
    paddingLeft:5,
  },

  filterButtonSelectedText:{
    color:'#fff',
    fontSize:height*0.023,
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

  row:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',
    width:width,
    height:height*0.12,

  },

  profile: {
    flex:1,
    backgroundColor: '#fff',
    justifyContent:'center',
    // height: height*0.8,
    alignItems:'center',

  },

  icon:{
    height:height*0.055,
    width:height*0.055,
    borderRadius:height*0.055/2,
    // marginTop:8,
    // marginBottom:5,
  },

  iconText:{
    marginTop:5,
    // marginRight:5,
    fontSize:height*0.018,
    fontWeight:'bold',
  },

  notification:{
    height:height*0.04,
    width:height*0.04,
    // marginTop:5,
    marginBottom:8,
  },
  headerButton:
  { 
    
    marginTop:10,
    height:height*0.04,
    width:height*0.04,
    marginLeft:15,
    marginRight:15,
    // alignSelf:'flex-start'
  },

  king:{
    height:0.22*height,
    width:0.22*height,
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
    // borderWidth: 2,
    // borderColor: '#00B0F0',
    paddingLeft:20,
    paddingRight:20,
  },
  planitText:{
      color:'#fff',
      textAlign:'center',
      fontSize:height*0.046,
      fontWeight:'bold'
  },


});
