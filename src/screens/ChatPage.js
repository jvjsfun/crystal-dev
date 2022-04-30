import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  FlatList,
  Alert,
  ImageBackground,
  StatusBar,
} from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';
import RNCalendarEvents from 'react-native-calendar-events';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import moment from 'moment';

var {height, width} = Dimensions.get('window');
//TODO: remove calendar event for deleted plans for other people
//TODO: don't allow editing on past plans

export default class ChatPage extends Component {


  state = {
    navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','groupName','invitedFriendNames','planId','planDate','dateEpoch','location','returnKey','previouslyAdded','timeType','timeString'],
    messages: [],
    joined:false,
    interested:false,
    
    plan:{
      planName:"Plan Loading...",
      planDateName: "",
      dateEpoch: new Date().getTime(),
      location:"Wherever",
      timeType:'specific',
      timeString:'',
    },
    planDate:new Date(),
    planId : "no plan Id",
    photoURL:"",
    currentUser:{},
    usersGoing:[],
    loading:true,
    loaded:false,
    messagesLoading:true,
    planLoaded:false,
    past:false,
    usersInvited:[],
    usersInterested:[],
    hostUser:{},

    // userLoading:true,
    // planLoading:true,
    // planDate:new Date()

  };

  /*
    View to add crown:
        <Image  
                  style = {this.state.plan.host === item.userid ? {height: height*0.027, width: height*.027 * (1/0.7)} : {height:0,width:0}}
                  source =  {require('./../icons/TopCrown.png')}
                  />
                  <View style = {this.state.plan.host !== item.userid ? {height: height*0.027, width: height*.027 * (1/0.7)} : {height:0,width:0}}/>
    

  */



  renderBubble = this.renderBubble.bind(this);


  componentWillMount(){

    let planId = this._navPropOrDefault('planId','no plan id');
    this.setState({
      planId: planId,
    });

    // console.log(this.props.navigation.state.params)
    let plan = {};
    plan.planName = this._navPropOrDefault('planName',"Plan Loading...");
    plan.dateEpoch = this._navPropOrDefault('dateEpoch',"");
    plan.location = this._navPropOrDefault('location',"Wherever");
    plan.timeString = this._navPropOrDefault('timeString','');
    plan.timeType = this._navPropOrDefault('timeType','');
    plan.planId = planId;
    // this.props.navigation.state.params.dateName = this.epochToString(plan.dateEpoch);
    let past = this._navPropOrDefault('past',"");
    // console.log(past);

    this.setState({plan:plan, past:past});

    this.initPlan(planId);
    this.initMessages(planId);
    this.initUser(planId);


    

    // let chatRef = firebase.database().ref("Chats/"+this.state.planId);
    // chatRef.on("child_added", (snapshot) => {
    //   var addedMessage = snapshot.val();
    //   this.setState((previousState) => ({
    //     messages: GiftedChat.append(previousState.messages, addedMessage),
    //   }));
    // });
    // TODO: Fix to scale.
    // let planId = this._navPropOrDefault('planId','no plan id');
    let planGoingRef = firebase.database().ref("Plans/"+planId+"/going/");
    planGoingRef.on("child_added", (snapshot) => {
      // console.log(this.state.loaded);
      if(this.state.loaded){
        this.initPlan(planId);
      }
    });

    planGoingRef.on("child_removed", (snapshot) => {
      // console.log(this.state.loaded);
      if(this.state.loaded){
        this.initPlan(planId);
      }
    });

    let planRef = firebase.database().ref("Plans/"+planId);
    planRef.on("child_changed",(snapshot) => {
      if(this.state.loaded){
        this.initPlan(planId);
      }
    });
    planRef.on("child_removed",(snapshot) => {
      if(snapshot.val() === this.state.planId){
        const { navigate, goBack } = this.props.navigation;
        let refresh = this._navPropOrDefault('refresh',false);
        if(refresh){
          refresh();
        }
        goBack();
      }
    });


    let planInviteRef = firebase.database().ref("Plans/"+planId+"/invitedFriends");
    planInviteRef.on("child_added",(snapshot) => {
      if(this.state.loaded){
        this.initPlan(planId);
      }
    });

    planInviteRef.on("child_removed",(snapshot) => {
      if(this.state.loaded){
        this.initPlan(planId);
      }
    });

    let planInterestRef = firebase.database().ref("Plans/"+planId+"/interested");
    planInterestRef.on("child_added",(snapshot) => {
      if(this.state.loaded){
        this.initPlan(planId);
      }
    });

    planInterestRef.on("child_removed",(snapshot) => {
      if(this.state.loaded){
        this.initPlan(planId);
      }
    });


  }

  componentWillUnmount(){

    let planId = this._navPropOrDefault('planId','no plan id');
    let planGoingRef = firebase.database().ref("Plans/"+planId+"/going/");
    planGoingRef.off("child_added");
    planGoingRef.off("child_removed");

    let planRef = firebase.database().ref("Plans/"+planId);
    planRef.off("child_changed");
    planRef.off("child_removed");


    let chatRef = firebase.database().ref("Chats/"+planId);
    chatRef.off("child_added");

    let planInviteRef = firebase.database().ref("Plans/"+planId+"/invitedFriends");
    planInviteRef.off("child_added");
    planInviteRef.off("child_removed");
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

  _getAcceptParameters(paramObject){
    let parameters = this._passNavParameters();
    for(let param in paramObject){
      parameters[param] = paramObject[param];
    }
    return parameters;
  }


  initMessages(planId){
    let lastUpdateDate = new Date().toISOString();
    firebase.database().ref("Chats/"+planId).once('value').then((snapshot) => {
      let chat = snapshot.val();
      // console.log(plan);
      if(chat){
        let messages = Object.values(chat);
        // console.log(messages);
        messages.sort(function(a,b){
          if(a.createdAt > b.createdAt){
            return -1;
          }
          else if (a.createdAt < b.createdAt){
            return 1;
          }
          return 0;
        });
        // console.log(messages);
        this.setState({messages:messages, messagesLoading:false});
      }
      else{
        this.setState({messagesLoading:false});
      }

      let lastUpdateDate = new Date().toISOString();
      let chatRef = firebase.database().ref("Chats/"+this.state.planId).orderByChild('createdAt').startAt(lastUpdateDate,'createdAt');
      chatRef.on("child_added", (snapshot) => {
        var addedMessage = snapshot.val();
        this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, addedMessage),
        }));
      });
    }); 
  }

  initUser(planId){
    let userid = firebase.auth().currentUser.uid;
    firebase.database().ref("Users/"+userid).once('value').then((snapshot)=>{
      // console.log(planId)

      let user = snapshot.val();
      // console.log(user)
      let joined = false;
      if(user.joined && user.joined[planId])
        joined = true;
      if(user.hosted && user.hosted[planId])
        joined = true;
      if(user.past && user.past[planId]){
        joined = true;
      }
      this.setState({currentUser:user, joined:joined, loading:false});

    });  
  }

  initPlan(planId){
    const { navigate, goBack } = this.props.navigation;
    firebase.database().ref("Plans/"+planId).once('value').then((snapshot) => {
      let plan = snapshot.val();
      if(!plan){
        //TODO: Test this
        let refresh = this._navPropOrDefault('refresh',false);
        if(refresh){
          refresh();
        }
        goBack();
      }
      // console.log(plan);
      // console.log(plan);
      // this.props.navigation.state.params.invitedFriends = plan.invitedFriends;
      // this.props.navigation.state.params.previouslyAdded = plan.invitedFriends;
      // console.log(plan);
      // console.log(plan.invitedFriends);
      this.setState({plan:plan, planLoaded:true});
      this.initAvatars();
    }); 
  }

  initAvatars(){
    let plan = this.state.plan;
    let peopleGoing = plan.going || {};
    this.state.usersGoing = [];
    this.state.usersInvited = [];

    let idArray = [];
    if(peopleGoing){
      idArray = Object.values(peopleGoing);
    }

    //Switch this to instead have a separate host category.
    firebase.database().ref("Users/"+plan.host).once('value').then((snapshot) => {
      let state = this.state;
      let host = snapshot.val();
      host.joinedPlan = true;
      // console.log(host);
      this.setState({hostUser : host});
    });

    for(let userid of idArray){
      firebase.database().ref("Users/"+userid).once('value').then((snapshot) => {
        let user = snapshot.val();
        // console.log(plan);
        let state = this.state;

        //REFACTOR: This code prevents duplicates
        let userAdded = false;
        for(let friendUser of state.usersGoing){
          if(friendUser.userid === user.userid){
            userAdded = true;
            break;
          }
        }
        user.joinedPlan = true;

        if(!userAdded){
          state.usersGoing.push(user);
          // console.log(user);
        }
        state.usersGoing = JSON.parse(JSON.stringify(state.usersGoing));
        //Refactor: Clean this, see https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs
        // state.usersGoing.sort(function(a,b){
        //   if(a.userid === plan.host){
        //     return -1;
        //   }
        //   else if(b.userid === plan.host){
        //     return 1;
        //   }
        //   else {
        //     return 0;
        //   }
        // });
        state.loaded = true;
        this.setState(state);
      });
    }

    
    if(!this.state.joined && !this.isUserInterested() && !this.isUserHost()){
      // console.log("not interested");
      return;
    }    
    let peopleInterested = plan.interested || {};
    // console.log(peopleInterested);
    let interestArr = [];
    if(peopleInterested){
      interestArr = Object.values(peopleInterested);
    }
    for(let interestedId of interestArr){
      // console.log(interestedId);
      firebase.database().ref("Users/"+interestedId).once('value').then((snapshot) => {

        let user = snapshot.val();
        // console.log(user);
        let state = this.state;
        let userAdded = false;
        for(let friendUser of state.usersInterested){
          if(friendUser.userid === user.userid){
            userAdded = true;
            break;
          }
        }
        user.joinedPlan = false;
        user.interestedInPlan = true;
        if(!userAdded){
          state.usersInterested.push(user);
        }
        state.usersInterested = JSON.parse(JSON.stringify(state.usersInterested));
        this.setState(state);
        // console.log(state);
      });
    }


    //Only allow people to see invited users if they are the host..
    if(!this.isUserHost()){
      return;
    }

    let peopleInvited = plan.invitedFriends || {};

    let idArr = [];
    if(peopleInvited){
      idArr = Object.values(peopleInvited);
    }
    for(let userid of idArr){
      // console.log(userid);
      //Don't add to invited list if they are going or interested.
      if(peopleGoing[userid] || peopleInterested[userid]){
        continue;
      }
      console.log(userid);
      firebase.database().ref("Users/"+userid).once('value').then((snapshot) => {
        let user = snapshot.val();
        // console.log(plan);
        let state = this.state;

        //REFACTOR: This code prevents duplicates
        let userAdded = false;
        for(let friendUser of state.usersInvited){
          if(friendUser.userid === user.userid){
            userAdded = true;
            break;
          }
        }
        user.joinedPlan = false;
        user.interestedInPlan = false;
        if(!userAdded){
          state.usersInvited.push(user);
        }
        state.usersInvited = JSON.parse(JSON.stringify(state.usersInvited));
        //Refactor: Clean this, see https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs
        // state.usersInvited.sort(function(a,b){
        //   if(a.userid === plan.host){
        //     return -1;
        //   }
        //   else if(b.userid === plan.host){
        //     return 1;
        //   }
        //   else {
        //     return 0;
        //   }
        // });
        // console.log(state.usersInvited);
        state.loaded = true;
        // console.log(state);
        this.setState(state);
      });
    }



  }



  onSend(messages = []) {
    //console.log(this.state.planId)
    if(this.state.joined)
      firebase.analytics().logEvent("send_message");
    else{
      firebase.analytics().logEvent("not_joined_send_message");
    }
    let chatRef = firebase.database().ref("Chats/"+this.state.planId);
    for(let message of messages){
      message.user.name = this.state.currentUser.fullname
      message.user._id = this.state.currentUser.userid
      message.user.avatar = this.state.currentUser.photoURL
      let chatAddedRef = chatRef.push();
      message._id = chatAddedRef.key;
      chatAddedRef.set(message);
    }

    
  }

  interestedPressed(){
    console.log("interested pressed");
    firebase.analytics().logEvent("interested");
    let planId = this.state.planId;
    let userid = firebase.auth().currentUser.uid;

    console.log(planId);
    console.log(userid);

    let interestedRef = firebase.database().ref("Users/"+userid+"/interested/");
    let addPlan = {};
    addPlan[planId] = planId;
    interestedRef.update(addPlan);

    let planInterestRef = firebase.database().ref("Plans/"+planId+"/interested/");
    let addUser = {};
    addUser[userid] = userid;
    planInterestRef.update(addUser);

    FCM.subscribeToTopic(planId);

    let usersInterested = JSON.parse(JSON.stringify(this.state.usersInterested));
    console.log(this.state.currentUser);

    let userClone = JSON.parse(JSON.stringify(this.state.currentUser));
    userClone.interestedInPlan = true;
    usersInterested.push(userClone);

    this.setState({interested:true, usersInterested: usersInterested});

    this.initPlan(planId);
    
  }

  joinPlan(){ 
    firebase.analytics().logEvent("join_plan");
    let userid =  firebase.auth().currentUser.uid;
    let planId = this.state.planId;
    let joinedRef = firebase.database().ref("Users/"+userid+"/joined");
    let addPlan = {};
    addPlan[planId] = planId;
    joinedRef.update(addPlan);

    let invitationRef = firebase.database().ref("Users/"+userid+"/invited/"+planId);
    invitationRef.remove();

    let interestedRef = firebase.database().ref("Users/"+userid+"/interested/"+planId);
    interestedRef.remove();

    let planInterestRef = firebase.database().ref("Plans/"+planId+"/interested/" + userid);
    planInterestRef.remove();

    let planGoingRef = firebase.database().ref("Plans/"+planId+"/going/");
    let addGoing = {};
    addGoing[userid] = userid;
    planGoingRef.update(addGoing);


    let plan = this.state.plan;
    let planDate = new Date(plan.dateEpoch);
    let startString = planDate.toISOString();
    planDate.setHours(planDate.getHours() + 1);
    let endString = planDate.toISOString();
    if(plan.timeType === "vague" && plan.timeString === "Whenever"){
      //Handle the whenever case.
    }
    else{
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
        let calendarRef = firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/calendarEvents/');
        let addCalendar = {};
        addCalendar[plan.planId] = id;
        calendarRef.update(addCalendar);
      })

      .catch(error => {
        console.log(error);
      });
    }

    FCM.subscribeToTopic(planId);


    let usersGoing = JSON.parse(JSON.stringify(this.state.usersGoing));
    let userClone = JSON.parse(JSON.stringify(this.state.currentUser));
    userClone.interestedInPlan = false;
    userClone.joinedPlan = true;
    usersGoing.push(userClone);

    this.setState({joined:true, usersGoing:usersGoing})
  }

  render() {
    // console.log(this.state.messages);
    const { navigate, goBack } = this.props.navigation;
    return (

      <View style = {styles.container}>
        <StatusBar barStyle = "dark-content"/>
        <View style = {{height:height*.018, backgroundColor:'white'}}/>

        <View style = {styles.chatHeader}>
          <View style = {styles.row}>
          
            <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.leaveChat()}>
              <Image source = {require('./../icons/Back.png')} style = {styles.backButton}  />
            </TouchableHighlight>
            
            <View style = {{flex:1}}>
              <Text numberOfLines = {1} style = {styles.header}>
                {this.state.plan.planName}
              </Text>
              <Text numberOfLines = {1} style = {[styles.subText,{color:'#f9264f',fontWeight:'600'}]}>
                {this.getPlanDateString(this.state.plan)}
              </Text>
              <Text numberOfLines = {1} textDecorationLine = {this.state.plan.location &&  this.state.plan.location!== "Wherever" ? "underline" : "none"} selectable = {(this.state.plan.location!== "Wherever")} style = {styles.subText}>
                {this.state.plan.location || "Wherever"}
              </Text>

              
            </View>

            {this.renderEditButton()}
            {this.renderLeaveButton()}
          </View>


        </View>

        <View style = {styles.divider}/>

        <View style = {{height:height*0.13, width:width, justifyContent:'center'}}>
          <View style = {{width:width,height:height*0.13,flexDirection:'row'}}>
            <FlatList 
              horizontal = {true} 
              showsHorizontalScrollIndicator = {false}
              data = {this.getAvatarList()}
              renderItem={({ item }) => this.renderAvatarItem(item)}
              extraData = {this.state.usersInterested}
              keyExtractor = {item => item.userid}
            />
            {this.renderAddButton()}
          </View>
        </View>
        

        <View style = {styles.divider}/>

        {this.renderBody()}
        

        
        


        </View>


    );
  }

  renderBody(){
    if(this.state.loading){
      return (<View style = {{flex:1}}/>);
    }

    if((this.state.joined || this.isUserInterested())){
      return(
        <View style = {{flex:1}}>
        <GiftedChat
          messages={this.state.messages}
          textInputProps = {(this.state.loading)?{height:0,borderBottomWidth:0,borderTopWidth:0,marginTop:0,marginBottom:0,paddingTop:0,paddingBottom:0, multiline:false} : { height:height*0.07, multiline:false, paddingTop:0, paddingBottom:0, textAlignVertical:'center',justifyContent:'center', fontSize:height*0.03, lineHeight:height*0.03, marginTop:0,marginBottom:0}}
          composerHeight={height*0.07}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: firebase.auth().currentUser.uid
          }}  
          renderTime = {this._renderTime}
          renderBubble = {this.renderBubble}
          isLoadingEarlier = {false}
          loadEarlier = {false}
          bottomOffset = {this.state.joined ? 0 : height*0.098}
          // renderAvatar = {(avatarProps)=>this.renderAvatar(avatarProps)} 
          // renderComposer = {this.renderComposer}
          // showUserAvatar
          // renderFooter = {()=><View height = 0/>}
          // renderChatFooter = {()=><View height = 0/>}
          // bottomOffset = {height/2}
        />
        {this._renderButton()}
        </View>
      );
    }

    else{
      return(
        <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
          <TouchableHighlight onPress = {()=>this.interestedPressed()} underlayColor = 'rgba(255,255,255,0.1)'>
            <View style = {styles.interestedButton}>
              <Image  source = {require('./../icons/Star.png')} style = {{height:height*0.05, width:height*0.05, marginLeft:10}}/>
              <Text style = {styles.interestedText}>
                I'm Interested
              </Text>
            </View>
          </TouchableHighlight>

          <View style = {{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Image source = {require('./../icons/LockSmall.png')} style = {{height:height*0.04, width:height*0.04}}/>
            <Text style = {styles.lockText}>
              Press to see chat & who's going
            </Text>
          </View>


        </View>
      );
    }

  }

  renderAvatarItem(item){
    if(!item || Object.keys(item).length === 0){
      return;
    }
    if(item.userid === 'locked'){
      return(
        <View style = {{marginLeft: 15, marginTop:2, flex: 1, alignItems:'center',justifyContent:'center', alignItems:'center', alignSelf:'center'}}>
          <View style = {{justifyContent:'center',alignItems:'center'}}>
            <Image style = {[styles.avatar]} source = {require('./../icons/Lock.png')}/>
          </View>
          <Text style = {styles.avatarText}/>
        </View>
      );
    }
    return (
      <View style = {{marginLeft: 15, marginTop:2, flex: 1, alignItems:'center',justifyContent:'center', alignItems:'center', alignSelf:'center'}}>
        <View style = {{justifyContent:'center',alignItems:'center'}}>
          <Image style = {[styles.avatar, !item.joinedPlan ? {alignItems:'center',justifyContent:'center'}:{}]} source = {{uri:item.photoURL, cache : "force-cache"}}/>
          {this.renderAvatarIndicator(item)}
          {this.renderQuestionMark(item)}
        </View>
        <Text style = {styles.avatarText} numberOfLines = {1}>
          {item.fullname ? item.fullname.split(" ")[0]:""}
        </Text>
      </View>
    );
  }



  renderAvatarIndicator(item){
      console.log(item);
      if(item.userid === this.state.plan.host){
        return(
          <Image style = {styles.avatarIndicator} source = {require('./../icons/Hosting.png')}/>
        );
      }
      else if(item.joinedPlan){
        return(
          <Image style = {styles.avatarIndicator} source = {require('./../icons/Going.png')}/>
        );
      }

      else if(item.interestedInPlan){
        return(
          <Image style = {styles.avatarIndicator} source = {require('./../icons/Interested.png')}/>
        );        
      }
  }

  getAvatarList(){
    // console.log(styles);
    if((this.state.joined || this.isUserInterested())){
      let avatars = this.state.usersGoing.concat(this.state.usersInterested)
      avatars = avatars.concat(this.state.usersInvited); 
      // console.log(avatars.length);
      if(avatars.length > 0 && this.state.hostUser){
        avatars.splice(0,0,this.state.hostUser);
      }
      else if(this.state.hostUser){
        avatars = [this.state.hostUser];
      }
      return avatars;
    }

    else{
      let avatars = [];
      if(this.state.hostUser){
        avatars = [this.state.hostUser]
        avatars.push({
          userid:'locked',
          fullname:'',
        });
      }
      return avatars;
    }

  }

  renderAvatar(props){
    // console.log(props.isSameUser(props.currentMessage,props.previousMessage));
    console.log(props);
    // if(avat)
    // return(

    // )
    if(props.isSameUser(props.currentMessage,props.previousMessage)){
      return(
        <View style = {styles.chatAvatar}/>
      );
    }
    else{
      return (
        <Image
          source={{uri: props.currentMessage.user.avatar, cache:'force-cache'}}
          style={styles.chatAvatar}
        />
      );
    }
  }

  renderQuestionMark(item){
    // console.log(item);
    if(!this.state.plan.host || item.userid === 'locked' ){
      return;
    }

    if(item.interested && item.interested[this.state.planId]){
      return;
    }

    if(!item.joinedPlan && this.isUserHost()){
      console.log(item);
      return(
        <View style = {[styles.avatar,{position:'absolute',justifyContent:'center', alignItems:'center',backgroundColor:"rgba(255,255,255,0.5)"}]}>
          <Text style = {{fontSize:height*0.045, color:'black',fontWeight:'bold'}}>
            ?
          </Text>
        </View>
      );
    }
  }

  leaveChat(){
    const { navigate, goBack } = this.props.navigation;
    // console.log(this.props.navigation.state.params)
    let chatLeft = this._navPropOrDefault('chatLeft',{});

    this.setState({loaded:false});

    chatLeft();
    goBack();
  }

  showLeavePopup(){
    firebase.analytics().logEvent("leave_popup");
    Alert.alert(
      'Leave Plan?',
      'The Plan will still be available in My Plans.',
      [
        {text: 'Cancel', onPress: () => firebase.analytics().logEvent("cancel_leave_plan_from_chat"), style: 'cancel'},
        {text: 'Leave Plan', onPress: ()=>this.leavePlan()},
      ],
    )
  }

  leavePlan(){
    let plan = this.state.plan;
    firebase.analytics().logEvent("leave_plan_from_chat");
    FCM.unsubscribeFromTopic(plan.planId);

    let joinedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/joined/" + plan.planId);
    joinedRef.remove();

    let goingRef = firebase.database().ref("Plans/"+plan.planId + "/going/"+firebase.auth().currentUser.uid);
    goingRef.remove();

    let invitedRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid + "/invited/");

    let addPlan = {};
    addPlan[plan.planId] = plan.planId;
    invitedRef.update(addPlan);

    this.initPlan(plan.planId);
    this.initUser(plan.planId);
    this.deleteCalendarEvent(plan.planId);
  }

  deleteCalendarEvent(planId){
    firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/calendarEvents/'+planId).once('value').then((snapshot) => {
      let calendarEvent = snapshot.val();
      RNCalendarEvents.removeEvent(calendarEvent);
      let calendarRef = firebase.database().ref('Users/' + firebase.auth().currentUser.uid + '/calendarEvents/'+planId);
      calendarRef.remove();
    });
  }



  isUserHost(){
    return (this.state.plan.host === firebase.auth().currentUser.uid);
  }

  isUserInterested(){
    let interested = this.state.plan.interested || {};
    return (interested && interested[firebase.auth().currentUser.uid]);
  } 

  getPlanDateString(item){
    if(!item.timeType || item.timeType === 'specific'){
      return this.epochToString(item.dateEpoch);
    }
    else if(item.timeType === 'vague'){
      return this.epochToStringWithoutTime(item.dateEpoch) + item.timeString;
    }
  }

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

  _renderTime(){
    return null;  
  }

  _renderButton(){
    if(this.state.joined || this.state.loading){
      return null
    }
    return(
      <TouchableHighlight  disabled = {this.state.loading || !this.state.planLoaded} style = {styles.acceptButton} onPress = {()=>this.joinPlan()}>
        <Text style = {styles.acceptText}>
          I'm Going!
        </Text>
      </TouchableHighlight>
    )
  }

  renderEditButton(){
    const { navigate, goBack } = this.props.navigation;
    if(this.state.loading || this.state.past || !this.isUserHost()){
      return null;
    }
    return (
      <View style = {{flexDirection:'column', justifyContent:'center'}}>
        <TouchableHighlight disabled = {!this.state.planLoaded || !this.isUserHost()} underlayColor="rgba(255,255,255,0.1)" onPress = {()=>{firebase.analytics().logEvent("edit_plan");console.log(this._navPropOrDefault('dateName','')); navigate('EditPlan',this._passNavParameters())}}>
          <Image source = {require('./../icons/Edit.png')} style = {styles.editButton}/>
        </TouchableHighlight>
      </View>
    );
  }


  renderLeaveButton(){
    const { navigate, goBack } = this.props.navigation;
    if(this.state.loading || this.state.past || this.isUserHost() || !this.state.joined){
      return null;
    }
    return (
      <View style = {{flexDirection:'column', justifyContent:'center'}}>
        <TouchableHighlight disabled = {!this.state.planLoaded || this.isUserHost()} underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.showLeavePopup()}>
          <Image source = {require('./../icons/Leave.png')} style = {styles.editButton}/>
        </TouchableHighlight>
      </View>
    );
  }

  renderAddButton(){
    /*<View style = {{height:height*0.07,borderRightWidth:2, borderColor:'#d8d8d8',}}/>*/
    const { navigate, goBack } = this.props.navigation;
    if(!this.state.planLoaded || this.state.past || !this.isUserHost()){
      return null;
    }
    return (
      <View style = {{flexDirection:'row',alignItems:'center'}}>
      <TouchableHighlight style = {{paddingLeft:6, marginRight:10, alignItems:'center',justifyContent:'center', alignItems:'center'}} onPress = {()=>this.goAddMore()} underlayColor = "rgba(255,255,255,0.1)">
        <View style = {{ alignItems:'center',justifyContent:'center', alignItems:'center'}}>
          <Image style = {styles.avatar} source = {require('./../icons/AddMore.png')}/>
          <Text style = {[styles.avatarText,{color:'#d8d8d8'}]} numberOfLines = {1}>
            Add
          </Text>
        </View>
      </TouchableHighlight>
      </View>
    );
  }

  renderBubble(props) {

    //console.log(props);
    if (firebase.auth().currentUser.uid === props.currentMessage.user._id || (props.isSameUser(props.currentMessage, props.previousMessage) && props.isSameDay(props.currentMessage, props.previousMessage))) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#f0f0f0',
            },
            right: {
              backgroundColor: '#f9264f'
            }
          }}
        />
      );
    }
    return (
      <View>
        <Text numberOfLines = {1} style={styles.name}>{"  " + props.currentMessage.user.name}</Text>
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#f0f0f0',
            },
            right: {
              backgroundColor: '#f9264f'
            }
          }}
        />
      </View>
    );
  }
  goAddMore(){
    firebase.analytics().logEvent("go_add_more");
    const { navigate, goBack } = this.props.navigation;
    console.log(this.props.navigation.state.params);
    console.log(this.state.plan.invitedFriends);
    navigate('AddMore',this._getAcceptParameters({previouslyAdded:this.state.plan.invitedFriends}))
  }

}




//TODO: Use PureComponent to make shit faster.
// class AvatarItem extends React.PureComponent {
//   render() {
//     return (
//       <View style = {{marginLeft: 14, flex: 1, alignItems:'center',justifyContent:'center', alignItems:'center', alignSelf:'center'}}>
//         <Image  
//         style = {this.state.plan.host === item.userid ? {height: height*0.027, width: height*.027 * (1/0.7)} : {height:0,width:0}}
//         source =  {require('./../icons/TopCrown.png')}
//         />
//         <View style = {this.state.plan.host !== item.userid ? {height: height*0.027, width: height*.027 * (1/0.7)} : {height:0,width:0}}/>
//         <Image style = {styles.avatar} source = {{uri:item.photoURL, cache : "force-cache"}}/>
//         <Text style = {styles.avatarText} numberOfLines = {1}>
//           {item.fullname.split(" ")[0]}
//         </Text>
//       </View>
//     )
//   }
// }


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
    //alignItems: 'center',
    justifyContent: 'flex-end',
  },

  divider:{
    borderBottomColor:'#e4e4e4',
    borderBottomWidth:1,
  },

  profile: {
    flex:1,
    backgroundColor: '#f9f9f9',
    justifyContent:'center',
    height: height/3,
    alignItems:'center',
  },


  profileText: {
    fontSize: 20,
    marginTop:  25,
    // marginBottom: 20,
    textAlign: 'center',
    justifyContent: 'center',
    color:'#404047'
  },

  usernameText:{
    fontSize: 12,
    marginTop:  5,
    marginBottom: 5,
    textAlign: 'center',
    justifyContent: 'center',
    color:'#8090b4'
  },

  acceptButton:{
    height:height*0.098, //If you change this you need to also change bottomOffset
    backgroundColor:'#00B0F0',
    alignItems:'center',
    justifyContent:'center',
  },

  acceptText:{
    fontSize:33,
    textAlign:'center',
    color:'#fff',
    fontWeight:'bold',
  },



  header: {
    fontSize: height*0.03,
    // marginTop:  30,
    // marginBottom: 5,
    textAlign: 'left',
    justifyContent: 'center',
    color:'#000',
    fontWeight:'600',
  },


  subText:{
    fontSize: height*0.027,
    marginTop:  1,
    textAlign: 'left',
    justifyContent: 'center',
    color:'black',
    // fontWeight:'bold',
  },

  



  fullWidthButton: {
    backgroundColor: 'red',
    height:170,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  listItem: {
    height:height*.1212121212,
    justifyContent:'center',
  },

  row:{
    flexDirection : 'row',
    justifyContent: 'flex-start',
    alignItems:'center',
    width:width,
    flex:0

  },
  testButton:{

    alignSelf:'stretch',
  },
  settingsButton:
  { 
    marginTop:10,
    height:30,
    width:30,
    marginLeft:10,
    alignSelf:'flex-start'
  },

  chatHeader:{
    height:height*0.16,
    backgroundColor:'white',
    justifyContent:'center',
  },


  backButton:
  { 
    height:height*0.0525,
    width:height*0.0525,
    marginRight:10,
    marginLeft:10,
    alignSelf:'flex-start'
  },
  
  editButton:
  { 
    height:height*0.05,
    width:height*0.05,
    marginRight:10,
    marginLeft:10,
    alignSelf:'flex-start'
  },

  avatar:{
    height:0.082*height,
    width:0.082*height,
    borderRadius:(0.082/2)* height,
  },

  avatarText:{
    fontSize:height*0.019,
    fontWeight:'bold',
    color:'gray',
  },

  addMore:{
    height:0.065*height,
    width:0.065*height,
    borderRadius:(0.065/2)* height,
  },

  chatAvatar:{

    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight:8,
  
  },

  avatarIndicator:{
    position:'absolute', 
    left:height*0.062,  
    height:height*0.04, 
    width:height*0.04, 
    borderRadius:height*0.04/2
  },

  interestedButton:{
    marginRight:height*0.035,
    marginLeft:height*0.035,
    marginBottom:10,
    height:height*0.122,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FF85FF',
    borderRadius:12,
    borderWidth: 2,
    borderColor: '#FF85FF',
    flexDirection:'row',
  },
  interestedText:{
    color:'#fff',
    textAlign:'center',
    fontSize:height*0.046,
    fontWeight:'bold',
    marginLeft:10,
    marginRight:10,
  },

  lockText:{
    color:'gray',
    fontSize:height*0.02,
    marginLeft:5,
  }


});