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
  FlatList,
  StatusBar,
} from 'react-native';

// import {Button as uButton} from 'react-native-elements';
// import { Button } from 'react-native-elements'

import { List, ListItem, Icon } from 'react-native-elements'
import firebase from 'react-native-firebase';;
import User from '../helper/User.js'


/*
              <View style = {{marginLeft: 5, flex: 1, alignItems:'center',justifyContent:'flex-start', flexDirection:'row'}}>
                
                <Image style = {styles.avatar} source = {{uri:item.photoURL}}/>
                <Text style = {styles.avatarText} numberOfLines = {1}>
                  {item.fullname}
                </Text>
              </View>
              */

var {height, width} = Dimensions.get('window');

export default class MyFriends extends Component {

  constructor() {
      super();

      this.state = {
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','nameOfGroup','groupId','edit','previousScreen','returnKey','invitedGroupNames','invitedGroups','selectionType','groupInfo'],
          currentUser:{},
          text:"",
          friendUsers:[],
          groups:[],   
          loaded:false,
      }
  }


  componentWillMount(){

  }

  componentDidMount(){
    this.initUser();
    let friendsRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/currentFriends");
    friendsRef.on("child_added", (snapshot) => {
      if(this.state.loaded)
        this.initUser();
    });

    let groupsRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/groups");
    groupsRef.on("child_added", (snapshot) => {
      if(this.state.loaded)
        this.initUser();
    });
    groupsRef.on("child_removed", (snapshot) => {
      if(this.state.loaded)
        this.initUser();
    });

  }

  componentWillUnmount(){
    let groupsRef = firebase.database().ref("Users/"+this.state.currentUser.userid+"/groups");
    let friendsRef = firebase.database().ref("Users/"+this.state.currentUser.userid+"/currentFriends");
    friendsRef.off("child_added");
    groupsRef.off("child_added");
    groupsRef.off("child_removed");
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
            My Friends
          </Text>
          <View style = {{flex:1,flexDirection:'row'}}/>
         
        </View>

        <View style = {styles.divider}/>
        


          <FlatList 
            
            data = {this.getListData()}
            renderItem={({item})=>this.renderItem(item)}
          
            extraData = {this.state.friendUsers}
            keyExtractor = {item => item.userid}
          />


      </View>
    );
  }


  renderItem(item){
    // console.log(item);
    if(item.type === 'user'){
      return(
        <ListItem
        roundAvatar

        title={item.fullname}
        titleStyle = { {fontSize:height*0.025, fontWeight:'bold', color:'black'} }
        hideChevron
        subtitle={item.username}
        subtitleStyle = { {fontSize:height*0.019} }
        leftIcon = {
          <Image source = {item.photoURL ? 
            {
              uri:item.photoURL,
              cache : "force-cache"
            } 
            : 
            require('./../icons/ProfileFinal.png')
            }  
            style = {styles.avatar}
          />
        } 
        containerStyle={styles.listItem}
      
     
        />

      );
    }


    else if(item.type ==='group'){
      return(
        <TouchableHighlight disabled = {item.groupType !== 'create'} style = {{justifyContent:'center'}} underlayColor="rgba(255,255,255,0.1)" onPress = {this._onPressRow.bind(this,item)}>
        <View style = {[{flexDirection:'row', alignItems:'center'},styles.divider]}>
          <Text
            numberOfLines = {1}
            style={[styles.item, item.groupType === 'create' ? {color:'black', fontWeight:'normal'} : {}]}
          >
            {item.groupName}
          </Text>
          <View style = {{flexDirection:'row',flex:1}}/>
          {this.renderEditGroup(item)}
        </View>
        </TouchableHighlight>
      );
        
    }

    else if (item.type ==='header'){
      return(
        <View style = {styles.sectionHeader}>
          <Text style = {styles.sectionHeaderText}>
            {item.text}
          </Text>
        </View>
      );
    }


  }

  renderEditGroup(item){
    if(item.groupType !== 'standard'){
      return;
    }
    return(
      <TouchableHighlight style = {styles.editButton} onPress = {this._onPressRow.bind(this,item)}>
        <Text style = {styles.editButtonText}>
          Edit  
        </Text>
      </TouchableHighlight>      
    );
  }




  _onPressRow(item){
    const { navigate, goBack } = this.props.navigation;
    if(item.type === 'group' && item.groupType === 'standard'){
      firebase.analytics().logEvent("edit_group_pressed");
      navigate("CreateGroup",this._getAcceptParameters({edit:true,nameOfGroup:item.groupName,groupId:item.groupId, friendsInGroup : item.friendsInGroup, friendUsers:this.state.friendUsers}));
    }
    if(item.type === 'group' && item.groupType === 'create'){
      firebase.analytics().logEvent("create_group_pressed");
      navigate("CreateGroup",this._getAcceptParameters({edit:false, friendUsers:this.state.friendUsers}));
    }
  }

  _getAcceptParameters = (paramObject) => {
    let parameters = this._passNavParameters();
    for(let param in paramObject){
      parameters[param] = paramObject[param];
    }
    return parameters;
  }


  getListData(){
    let listData = [];

    listData.push({
      type:'header',
      text:'GROUPS',
    });
    listData.push({
      type:'group',
      groupName: 'All Friends',
      groupType: 'All Friends',
    });
    console.log(this.state.groups);
    listData = listData.concat(this.state.groups);
    listData.push({  
      type:'group',
      groupType:'create',
      groupName:'+ Create New Group'
    });
    listData.push({
      type:'header',
      text:'ALL FRIENDS'
    });
    listData = listData.concat(this.state.friendUsers);
    
    return listData;
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

 

  initUser(){
    // console.log("in init user");
    let userid = firebase.auth().currentUser.uid;
    firebase.database().ref("Users/"+userid).once('value').then((snapshot)=>{
      let user = snapshot.val();
      let groups = [];
      if(user.groups){
        groups = Object.values(user.groups);
      }
      for(let group of groups){
        group.type = 'group';
        group.groupType = 'standard';
      }
      // console.log(groups);
      
      this.setState({currentUser:user, groups:groups, loaded:true});
      this.initAvatars(user.currentFriends);
    });  
  }

  initAvatars(friendIds){
    // console.log("in init avatars");
    // console.log(friendIds);
    if(friendIds){
      for(let userid of Object.values(friendIds)){
        
        firebase.database().ref("Users/"+userid).once('value').then((snapshot) => {
          let user = snapshot.val();
          user.type = 'user';
          // console.log(plan);
          let state = this.state;
          // console.log(user);
          //REFACTOR: This code prevents duplicates
          let userAdded = false;
          for(let friendUser of state.friendUsers){
            if(friendUser.userid === user.userid){
              userAdded = true;
              break;
            }
          }

          if(!userAdded){
            state.friendUsers.push(user);
          }
          console.log(state.friendUsers);
          state.friendUsers = JSON.parse(JSON.stringify(state.friendUsers));
          //Refactor: Clean this, see https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs
          // console.log(state.friendUsers);
          this.setState(state);
        });
      }
    }
  
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
    marginTop:10,
    marginLeft:10,
    height:30,
    width:30,
    alignSelf:'flex-start'
  },

  sectionHeader:{
    height:height*0.047,
    backgroundColor:'#ededed',
    justifyContent:'center',
    alignItems:'flex-start',
  },

  sectionHeaderText:{
    marginLeft:10,
    color:'gray',
    fontSize:height*0.019,
    fontWeight:'bold',
  },

  avatar:{
    height:0.068*height,
    width:0.068*height,
    borderRadius:(0.068/2)* height,
  },

  avatarText:{
    fontSize:height*0.019,
    color:'gray',
    marginLeft:5,
  },

  listItem:{ 
    borderBottomWidth: 1, 
    borderBottomColor:'#e4e4e4',
    height:height*0.07, 
    justifyContent:'center', 
  },

    avatar:{
    height:height*0.047,
    width:height*0.047,
    borderRadius:(height*0.047)/2,
    // marginLeft:10,
    marginRight:10,
  },


 editButton:{
    marginLeft:5,
    marginRight:5,
    marginTop:5,
    marginBottom:5,
    borderRadius:10,
    backgroundColor:'#b8b8b8',
    // borderColor:'#f9264f',
    width: height*0.103,
    height:height*0.057,
    justifyContent:'center',
    alignItems:'center',
    // borderWidth:1,
  },

  editButtonText:{
    color:'white',
    fontSize:14,
    fontWeight:'bold',
  },

  item: {
    borderRadius:5,
    // borderColor:'#efefef',
    borderColor:'#f9264f',
    padding: 10,
    fontSize: height*0.03,
    fontWeight:'bold',
    // height: 44,
    color: '#f9264f',
    marginLeft:height*0.015,
    marginRight:height*0.015,
  },

  
});