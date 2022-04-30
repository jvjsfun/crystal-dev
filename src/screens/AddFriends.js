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
  ActivityIndicator,
  FlatList,
  StatusBar,
} from 'react-native';

// import {Button as uButton} from 'react-native-elements';
// import { Button } from 'react-native-elements'

import { List, ListItem, Icon } from 'react-native-elements'
import firebase from 'react-native-firebase';
import User from '../helper/User.js'
var Contacts = require('react-native-contacts')




var {height, width} = Dimensions.get('window');

export default class AddFriends extends Component {

  constructor() {
      super();

      this.state = {
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName'],
          currentUser:{},
          searchTerm:"",
          foundUsers:[],
          addedUsers:{},
          refreshing:false,
          loading:false,
          contacts:false,
          contactsFound:[],
          contactsToInvite:[],
          numbersProcessed:{},
      }
  }

  makeRemoteRequest = () => {

    // const { page, seed } = this.state;
    // const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    // this.setState({ loading: true });

    // fetch(url)
    //   .then(res => res.json())
    //   .then(res => {
    //     this.setState({
    //       data: page === 1 ? res.results : [...this.state.data, ...res.results],
    //       error: res.error || null,
    //       loading: false,
    //       refreshing: false
    //     });
    //   })
    //   .catch(error => {
    //     this.setState({ error, loading: false });
    //   });
  };

  handleRefresh = () => {
    // this.setState(
    //   {
    //     page: 1,
    //     seed: this.state.seed + 1,
    //     refreshing: true
    //   },
    //   () => {
    //     this.makeRemoteRequest();
    //   }
    // );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
   };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: width,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };


  componentWillMount(){

  }

  componentDidMount(){
    this.initUser();
    let friendRequestRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/friendRequests");
    friendRequestRef.on("child_added", (snapshot) => {
      this.initUser();
    });
    friendRequestRef.on("child_removed", (snapshot) => {
      this.initUser();
    });

    let friendsRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/currentFriends");
    friendsRef.on("child_added", (snapshot) => {
      this.initUser();
    });
  }

  componentWillUnmount(){
    let friendRequestRef = firebase.database().ref("Users/"+this.state.currentUser.userid+"/friendRequests");
    friendRequestRef.off("child_added");
    friendRequestRef.off("child_removed");

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
            Add Friends
          </Text>
          <View style = {{flex:1,flexDirection:'row'}}/>
        </View>

        <View style = {styles.divider}/>


        <View style = {styles.search}>
          <Image
            source = {require('./../icons/Search.png')}
            style = {{marginLeft:10, height: height*0.034, width: height*0.034}}
          />

          <TextInput
            style={styles.searchEntry}
            underlineColorAndroid='transparent'
            // onPress={() => this.searchEntrySuggestion(this.props)}
            autoFocus = {true}
            placeholder = 'Search for contacts or usernames'
            placeholderTextColor= '#a8a8a8'
            returnKeyType = {'done'}
            autoCapitalize = 'none'
            underlayColor='#fff'
            onChangeText={(username) => this.searchForUsername(username)}
            value={this.state.searchTerm}
            // onsearchEntryEditing = {}
          />

          

        </View>


        <View style = {styles.divider}/>


        <Text style = {styles.sectionText}>
          FRIENDS ON PLANIT
        </Text>

        <View style = {styles.divider}/>


        <FlatList
            data={this.getListData()}
            extraData={this.state.addedUsers}
            renderItem={({ item }) => (
              
              <ListItem
                  roundAvatar

                  title={item.fullname}
                  titleStyle = { {fontSize:height*0.025, fontWeight:'bold'} }

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
                    style = {styles.avatar}/>
                  } 
                  containerStyle={styles.listItem}
                  onPress = {this._onPressRow.bind(this, item)}
                  rightIcon = {this.renderRightButton(item)}
                  />

            )}
            keyExtractor={item => item.type + item.userid}
            // ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.printState.bind(this)}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
      </View>
    );
  }

  getListData(){
    // let oldTime = new Date().getTime();
    let allData = [];
    let foundUsers = this.state.foundUsers;

    let contactsFound = this.state.contactsFound;
    // let newTime = new Date().getTime();
    // console.log(newTime - oldTime);
    return foundUsers.concat(this.state.contactsFound);
  }

  renderRightButton(item){
    if(this.state.currentUser.friendRequests && this.state.currentUser.friendRequests[item.userid]){
      // console.log("HELLO");
      return(
        <TouchableHighlight style = {styles.friendButton} onPress = {this.acceptFriendRequest.bind(this,item)}>
          <Text style = {styles.friendButtonText}>
            Accept  
          </Text>
        </TouchableHighlight>      
      );
    }
    else if(this.state.addedUsers[item.userid]){
      return(
        <TouchableHighlight style = {styles.removeFriendButton} onPress = {this.removeFriend.bind(this,item)}>
          <Text style = {styles.removeFriendButtonText}>
            Remove
          </Text>
        </TouchableHighlight>
      );
    }
    else {
      return(
        <TouchableHighlight style = {styles.friendButton} onPress = {this.addFriend.bind(this,item)}>
          <Text style = {styles.friendButtonText}>
            Add
          </Text>
        </TouchableHighlight>
      );
    }            
  }

  addFriend(item){
    firebase.analytics().logEvent("friend_added");
    let userid = firebase.auth().currentUser.uid;
    let database = firebase.database();
    //console.log(item)
    //console.log(userid);
    let userRef = database.ref('Users/' + item.userid+'/friendRequests');
    let addRequest = {};
    addRequest[userid] = userid;
    userRef.update(addRequest);

    let requestsSentRef = database.ref('Users/' + userid+'/requestsSent');
    let addSentRequest = {};
    addSentRequest[item.userid] = item.userid;
    requestsSentRef.update(addSentRequest);


    let addedUsers = JSON.parse(JSON.stringify(this.state.addedUsers));
    addedUsers[item.userid] = true;
    this.setState({addedUsers:addedUsers})
    //console.log(this.state.addedUsers);
  }

  removeFriend(item){
    firebase.analytics().logEvent("undo_friend_request");
    let userid = firebase.auth().currentUser.uid;
    let database = firebase.database();
    let requestRef = database.ref('Users/' + item.userid+'/friendRequests/'+userid);
    requestRef.remove();

    let requestSentRef = database.ref('Users/' + userid+'/requestsSent/'+item.userid);
    requestSentRef.remove();

    let addedUsers = JSON.parse(JSON.stringify(this.state.addedUsers));
    addedUsers[item.userid] = false;
    this.setState({addedUsers:addedUsers});

    // //console.log(this.state.addedUsers);
  }

  acceptFriendRequest(item){
    firebase.analytics().logEvent("request_accepted_from_add");
    let userid = firebase.auth().currentUser.uid;
    let database = firebase.database();
    
    //Remove old request
    let userFRRef = database.ref('Users/' + userid+'/friendRequests/' + item.userid);
    userFRRef.remove();

    let userFriendsRef = database.ref('Users/' + userid+'/currentFriends/');
    let addFriend = {};
    addFriend[item.userid] = item.userid;
    userFriendsRef.update(addFriend);


    let requestsSentRef = database.ref('Users/' + item.userid + '/requestsSent/' + userid);
    requestsSentRef.remove();


    let otherUserFriendsRef = database.ref('Users/' + item.userid+'/currentFriends/');
    addFriend = {};
    addFriend[userid] = userid;
    otherUserFriendsRef.update(addFriend);

    this.setState({flipToRefresh:!this.state.flipToRefresh})


  }

  _onPressRow(item){
    //console.log('row pressed')
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
    console.log(this.state);
  }

  searchForUsername(username){

    this.setState({searchTerm:username});

    if(username === ""){
      let contactsFound = this.state.contactsFound;
      contactsFound.sort(function(a,b){
        if(a.fullname < b.fullname){
          return -1;
        }
        else if(a.fullname > b.fullname){
          return 1;
        }
        else {
          return 0;
        }
      });

      this.setState({foundUsers:[], contactsFound:contactsFound});
      return;
    }

    username = username.toLowerCase();
    firebase.database().ref('Usernames/' + username).once('value').then((snapshot)=> {
      let userid = snapshot.val();
      //console.log(userid);
      if(userid !== null){
        if(!(this.state.currentUser.currentFriends || userid === firebase.auth().currentUser.uid)){
          this.getUserData(userid,"username",this.populateSearch);
          return;
        }
        if(!( this.state.currentUser.currentFriends[userid] || userid === firebase.auth().currentUser.uid)){
          this.getUserData(userid,"username",this.populateSearch);
        }
      }
      else{
        this.setState({foundUsers:[]});
      }

    });

    let contactsFound = this.state.contactsFound;
    contactsFound.sort(function(a,b){
      if(a.fullname.toLowerCase().match(username) && !b.fullname.toLowerCase().match(username)){
        return -1;
      }
      else if(!a.fullname.toLowerCase().match(username) && b.fullname.toLowerCase().match(username)){
        return 1;
      }
      else {
        return 0;
      }
    });

  }

  populateSearch(userData, type){
    //console.log(userData)
    userData.type = type;
    let foundUsers = [];
    foundUsers.push(userData);
    this.setState({foundUsers:JSON.parse(JSON.stringify(foundUsers))});
    //console.log(this.state.foundUsers);
  }
 

  getUserData(userid, type, responseFunction){
    //console.log("Getting uid: " + userid)
    firebase.database().ref('Users/' + userid).once('value').then((snapshot)=> {
      var userData = snapshot.val();
      // //console.log(userData);
      let boundResponse = responseFunction.bind(this);
      boundResponse(userData, type);
    });

  }

  initUser(){
    firebase.database().ref('Users/' + firebase.auth().currentUser.uid).once('value').then((snapshot)=> {
      let currentUser = snapshot.val();
      let requestsSent = this.state.addedUsers;
      if(currentUser.requestsSent){
        for(let friendid of Object.values(currentUser.requestsSent)){
          requestsSent[friendid] = true;
        }
      }

      // console.log(currentUser);

      this.setState({currentUser:currentUser, addedUsers : JSON.parse(JSON.stringify(requestsSent))});

    });    

    if(!this.state.contacts){
      this.setState({contacts:true});
      Contacts.getAllWithoutPhotos((err, contacts) => {
        if(err === 'denied'){
          //Permission rejected
        } else {
          firebase.database().ref("PhoneNumbers/").once('value').then((snapshot)=>this.processContacts(contacts, snapshot.val()));
        }
      })
    }
  }

  processContacts(contacts, numbers){
    // console.log(contacts)
    for(let contact of contacts){
      if(contact.phoneNumbers){
        let contactFound = false;
        for(let unformatNumber of contact.phoneNumbers){
          let number = ""+unformatNumber.number.replace(/\D+/g, "").replace(/^[01]/, "");
          if(numbers[number]){
            contactFound = true;
            if(!this.state.numbersProcessed[number]){
              let userid = numbers[number];
              firebase.database().ref("Users/"+userid).once('value').then((snapshot)=>{
                let user = snapshot.val();
                user.type = 'contacts';
                let contactsFound = this.state.contactsFound;
                if(!(this.state.currentUser.currentFriends && this.state.currentUser.currentFriends[user.userid])){
                  if(user.userid !== firebase.auth().currentUser.uid){
                    contactsFound.push(user);
                    contactsFound.sort(function(a,b){
                      if(a.fullname < b.fullname){
                        return -1;
                      }
                      else if(a.fullname > b.fullname){
                        return 1;
                      }
                      else {
                        return 0;
                      }
                    });
                  }
                }


                
                let numbersProcessed = this.state.numbersProcessed;
                numbersProcessed[number] = true;
                this.setState({contactsFound:contactsFound, numbersProcessed});
              });
              break;
            }
          }
        }
        if(!contactFound){
          //Add to invite list
        }

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
    height:height*0.07,
    width:width,
    flex:0,
    flexDirection:'row',
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'flex-start',
  },

  searchEntry:{
    borderColor: '#fff',
    flex:1,
    marginLeft:10,
    fontSize:height*0.025,
    borderBottomColor:'#e4e4e4'
  },


  sectionText:{
    marginLeft:10,
    marginTop:10,
    marginBottom:10,
    fontSize:height*0.019,
    fontWeight:'bold',
    color:'#a8a8a8'
  },

  profile: {
    flex:1,
    backgroundColor: '#f9f9f9',
    justifyContent:'center',
    height: height/3,
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

  avatar:{
    height:height*0.047,
    width:height*0.047,
    borderRadius:(height*0.047)/2,
    // marginLeft:10,
    marginRight:10,
  },

 friendButton:{
    marginLeft:10,
    borderRadius:10,
    backgroundColor:'#f9264f',
    borderColor:'#f9264f',
    width: height*0.103,
    height:height*0.047,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
  },

  friendButtonText:{
    color:'white',
    fontSize:14,
    fontWeight:'bold',
  },

  removeFriendButton:{
    borderRadius:10,
    backgroundColor:'#f9f9f9',
    borderColor:'gray',
    width: height*0.103,
    height:height*0.047,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
  },

  removeFriendButtonText:{
    color:'gray',
    fontSize:13,
    // fontWeight:'bold',
  },

  // yourself:{
  //   borderRadius:10,
  //   backgroundColor:'#f9f9f9',
  //   borderColor:'gray',
  //   width: height*0.103,
  //   height:height*0.047,
  //   justifyContent:'center',
  //   alignItems:'center',
  //   borderWidth:1,
  // },

  listItem:{ 
    borderBottomWidth: 1, 
    borderBottomColor:'#e4e4e4',
    height:height*0.07, 
    justifyContent:'center', 
    borderTopWidth:0,
  },
  
});