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

export default class CreateGroup extends Component {

  constructor() {
      super();

      this.state = {
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedGroups'],
          currentUser:{},
          text:"",
          friendUsers:[],
          groups:[],
          edit:false,
          groupId:'',
          nameOfGroup:'',
          friendsInGroup:{},
          
      }
  }


  componentWillMount(){
    let name = this._navPropOrDefault('nameOfGroup','');
    let groupId = this._navPropOrDefault('groupId','');
    let edit = this._navPropOrDefault('edit',false);
    let friendsInGroup = this._navPropOrDefault('friendsInGroup',{});
    let friendUsers = this._navPropOrDefault('friendUsers',[]);
    this.setState({nameOfGroup:name,groupId:groupId, edit:edit, friendsInGroup:friendsInGroup, friendUsers:friendUsers});

    
  }

  componentDidMount(){
    this.initUser();
    let friendsRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/currentFriends");
    friendsRef.on("child_added", (snapshot) => {
      this.initUser();
    });
  }

  componentWillUnmount(){
    let friendsRef = firebase.database().ref("Users/"+this.state.currentUser.userid+"/currentFriends");
    friendsRef.off("child_added");
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
            {this.state.edit ? "Edit Group" : "Create Group"}
          </Text>
          <View style = {{flex:1,flexDirection:'row'}}/>
          {this.renderTrash()}

        </View>

        <View style = {styles.divider}/>
        
        <View style = {[{flexDirection:'row', alignItems:'flex-start'},styles.divider]}>
          <TextInput
            numberOfLines = {1}
            style={[styles.input, {color:'black', fontWeight:'normal'}]}
            value = {this.state.nameOfGroup}
            autoGrow = {false}
            underlineColorAndroid='transparent'
            autoFocus = {!this.state.edit}
            placeholder = 'Group Name'
            placeholderTextColor= '#a8a8a8'
            autoCapitalize = 'sentences'
            underlayColor='#fff'
            onChangeText={(nameOfGroup) => this.setState({nameOfGroup:nameOfGroup})}
          />
        </View>

        <View style = {styles.sectionHeader}>
          <Text style = {styles.sectionHeaderText}>
            ALL FRIENDS
          </Text>
        </View>

        <FlatList 
          keyboardShouldPersistTaps = {"never"}
          keyboardDismissMode="on-drag"
          data = {this.getListData()}
          renderItem={({item})=>this.renderItem(item)}
          extraData = {this.state.friendsInGroup}
          keyExtractor = {item => item.userid}
        />
        {this.renderAcceptCancelButtons()}
      </View>
    );
  }

  renderTrash(){
    if(!this.state.edit){
      return;
    }
    return(
      <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.deleteGroup()}> 
        <Image source = {require('./../icons/Trash.png')} style = {{width:height*0.035, height:height*0.035, marginRight:10, marginTop:10}}/>
      </TouchableHighlight>

    );
  }


  renderItem(item){
    console.log(item);
    if(item.type === 'user'){
      return(
      <ListItem
        roundAvatar
        title={item.fullname}
        titleStyle={{fontSize:height*0.03}}
        // subtitle={item.username}
        avatar={ item.photoURL ? { uri: item.photoURL } :
          require('./../icons/ProfileFinal.png')

        }
        containerStyle={styles.divider}
        onPress = {this._onPressRow.bind(this, item)}
        rightIcon = {this.state.friendsInGroup[item.userid] ?
          <Image source={require('./../icons/Select1.png')} style={{width: height/20, height: height/20, borderRadius:height/40}}/> :
          <Image source={require('./../icons/Select0.png')} style={{width: height/20, height: height/20, borderRadius:height/40}}/>
        }
      />

      );
    }


    else if(item.type ==='group'){
      return(
        <TouchableHighlight disabled = {item.groupType !== 'create'} style = {{justifyContent:'center'}} underlayColor="rgba(255,255,255,0.1)" onPress = {this._onPressRow.bind(this,item)}>
        <View style = {[{flexDirection:'row', alignItems:'flex-start'},styles.divider]}>
          <Text
            numberOfLines = {1}
            style={[styles.item, item.groupType === 'create' ? {color:'black', fontWeight:'normal'} : {}]}
          >
            {item.groupName}
          </Text>
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

  renderAcceptCancelButtons(){
    const { navigate, goBack } = this.props.navigation;
    if(this.isChoiceMade()){
      return(
        <View style = {styles.end}>
          <View style = {styles.buttonRow}>
            <TouchableHighlight
              style={styles.cancelButton}
              // onPress={() => this.submitSuggestion(this.props)}
              onPress={() => goBack(this._navPropOrDefault('returnKey',''))}
              underlayColor="rgba(255,255,255,0.1)">
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.acceptButton}
              // onPress={() => this.submitSuggestion(this.props)}
              onPress={() => this.acceptGroup()}
              underlayColor="rgba(255,255,255,0.1)">
              <Text style={styles.acceptText}>
                Accept
              </Text>
            </TouchableHighlight>

          </View>
        </View>
      );
    }
    return(
      <View style = {styles.end}>
        <View style = {styles.buttonRow}>
          <TouchableHighlight
            style={[styles.cancelButton,{width:width}]}
            // onPress={() => this.submitSuggestion(this.props)}
            onPress={() => goBack()}
            underlayColor="rgba(255,255,255,0.1)">
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </TouchableHighlight>

        </View>
      </View>
    );

  }

  isChoiceMade(){
    let nameOfGroup = this.state.nameOfGroup;
    if(nameOfGroup === 'All Friends' || nameOfGroup === 'Best Friends'){
      return false;
    }
    if(!this.state.edit){ 
      if(nameOfGroup && nameOfGroup !== this._navPropOrDefault('nameOfGroup','')){
        return true;
      }
    }
    else{
      let currentUser = this.state.currentUser;
      if(!currentUser.groups){
        return true;
      }
      let currentGroup = this.state.currentUser.groups[this.state.groupId];


      let oldFriendsInGroupsArray = [];
      if(currentGroup.friendsInGroup){
        oldFriendsInGroupsArray= Object.values(currentGroup.friendsInGroup);
      }
      let newFriendsInGroupsArray = Object.values(this.state.friendsInGroup);
      if(oldFriendsInGroupsArray.length !== newFriendsInGroupsArray.length){
        return true
      }
      for(let oldFriend of oldFriendsInGroupsArray){

        if(!this.state.friendsInGroup[oldFriend]){
          return true;
        }
      }
    }
    
    return false;
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
    if(item.type === 'user'){
      let friendsInGroup = this.state.friendsInGroup;
      let notInGroup = !friendsInGroup[item.userid];
      if(notInGroup){
        friendsInGroup[item.userid] = item.userid;
      }
      else{
        delete friendsInGroup[item.userid];
      }
      this.setState({friendsInGroup});
    }
  }

  getListData(){
    let listData = [];
    listData = listData.concat(this.state.friendUsers);
    
    return listData;
  }

  acceptGroup(){
    const { navigate, goBack } = this.props.navigation;
    let group = this.getGroup();
    let groupsRef = firebase.database().ref('Users/'+firebase.auth().currentUser.uid +'/groups/');
    
    if(this.state.edit){
      firebase.analytics().logEvent("group_edited");
      group.groupId = this.state.groupId;
      let groupRef = groupsRef.child(group.groupId);
      groupRef.set(group);
    }

    else{
      firebase.analytics().logEvent("group_created");
      let groupRef = groupsRef.push();
      group.groupId = groupRef.key;
      groupRef.set(group);
    }

    goBack();

  }

  deleteGroup(){
    firebase.analytics().logEvent("group_deleted");
    const { navigate, goBack } = this.props.navigation;
    let groupId = this.state.groupId;
    if(!groupId){
      return;
    }
    let groupRef = firebase.database().ref('Users/'+firebase.auth().currentUser.uid+'/groups/'+groupId);
    groupRef.remove();
    goBack();

  }

  getGroup(){
    let group = {};
    group.friendsInGroup = this.state.friendsInGroup;
    group.groupName = this.state.nameOfGroup;
    return group;
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
      this.setState({currentUser:user});
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
          console.log(user);
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
    marginLeft:10,
    borderRadius:10,
    backgroundColor:'gray',
    // borderColor:'#f9264f',
    width: height*0.103,
    height:height*0.047,
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

  input: {
    // borderColor:'#efefef',
    borderColor:'#f9264f',
    padding: 10,
    fontSize: height*0.035,
    fontWeight:'bold',
    // height: 44,
    color: '#f9264f',
    marginLeft:height*0.015,
    marginRight:height*0.015,
    width:width,
  },


  cancelButton:{
    height:height*0.09,
    backgroundColor:'#fff',
    // flex:1,
    width:width/2,
    alignItems:'center',
    justifyContent:'center',
  },

  cancelText:{
    fontSize:30,
    textAlign:'center',
    color:'#f9264f',
  },

  acceptButton:{
    height:height*0.09,
    width:width/2,
    backgroundColor:'#f9264f',
    alignItems:'center',
    justifyContent:'center',
  },

  acceptText:{
    fontSize:30,
    textAlign:'center',
    color:'#fff',
  },

  end:{
    // flex:1,
    justifyContent:'flex-end',
  },

  buttonRow:{
    marginTop:10,
    flex:0,
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',

  },



  
});