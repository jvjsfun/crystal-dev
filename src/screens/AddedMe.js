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
  ActivityIndicator,
  StatusBar
} from 'react-native';

// import {Button as uButton} from 'react-native-elements';
// import { Button } from 'react-native-elements'

import { List, ListItem, Icon } from 'react-native-elements'
import firebase from 'react-native-firebase';;
import User from '../helper/User.js'

/*
avatar={ item.photoURL ? 
                    
                    {uri:item.photoURL}
                    :
                    require('./../icons/ProfileFinal.png')
                  }
TODO: Improve caching here
                  */
var {height, width} = Dimensions.get('window');

export default class AddedMe extends Component {

  constructor() {
      super();

      this.state = {
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName'],
          currentUser:{
            friendRequests:[],
          },
          text:"",
          friendRequests:[],  
          refreshing:false,
          loading:false, 
          flipToRefresh:false,
      }
  }

  componentWillMount(){
    // //console.log("what the fuck");
    
  }

  componentDidMount(){
    this.initFriendsList();
    let friendRequestRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/friendRequests");
    friendRequestRef.on("child_added", (snapshot) => {
      this.initFriendsList();
    });
    friendRequestRef.on("child_removed", (snapshot) => {
      this.initFriendsList();
    });
  }

  componentWillUnmount(){
    let friendRequestRef = firebase.database().ref("Users/"+this.state.currentUser.userid+"/friendRequests");
    friendRequestRef.off("child_added");
    friendRequestRef.off("child_removed");
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
    // this.setState(
    //   {
    //     page: this.state.page + 1
    //   },
    //   () => {
    //     this.makeRemoteRequest();
    //   }
    // );
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
            Added Me
          </Text>
          <View style = {{flex:1,flexDirection:'row'}}/>
         
        </View>

        <View style = {styles.divider}>
        </View>


       
          <FlatList
            data={this.state.friendRequests}
            extraData={this.state.flipToRefresh}
            renderItem={({ item }) => (
              
              <ListItem
                  // roundAvatar
                  title={item.fullname}
                  titleStyle = { {fontSize:height*0.025, fontWeight:'bold'} }
                  subtitle={item.username}
                  subtitleStyle = { {fontSize:height*0.019} }

                  // leftIcon={
                      
                      
                      
                      
                  // }

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
                  rightIcon = {
                    <View style = {styles.buttonRow}>

                      <TouchableHighlight style = {styles.removeFriendButton} onPress = {this.removeFriendRequest.bind(this,item)}>
                        <Text style = {styles.removeFriendButtonText}>
                          Delete
                        </Text>
                      </TouchableHighlight>
                       

                      <TouchableHighlight style = {styles.friendButton} onPress = {this.acceptFriendRequest.bind(this,item)}>
                        <Text style = {styles.friendButtonText}>
                          Accept
                        </Text>
                      </TouchableHighlight>
                    </View>
                  }
                  />

            )}
            keyExtractor={item => item.userid}
            ItesmSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
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

  printState(){  
    //console.log(this.props);
  }

  initFriendsList(){
    //console.log(this.state.currentUser);
    this.setState({friendRequests:[]});
    firebase.database().ref('Users/' + firebase.auth().currentUser.uid + "/friendRequests").once('value').then((friendRequests)=> {
      //console.log("inside firebaase request");
      //console.log(friendRequests.val());
      let requests = friendRequests.val();
      if(!requests){
        return;
      }
      for(let userid of Object.values(requests)){
        firebase.database().ref('Users/' + userid).once('value').then((snapshot)=> {
          let userData = snapshot.val();       
          
          this.addUserDataToState(userData);
          
          this.setState({flipToRefresh:!this.state.flipToRefresh});
        });
      }    
    });
    // this.setState({flipToRefresh:!this.state.flipToRefresh});
  }

  addUserDataToState(userData){
    let friendRequests = this.state.friendRequests;
    for(let request of friendRequests){
      if(request.userid === userData.userid){
        friendRequests = JSON.parse(JSON.stringify(friendRequests));
        this.setState({friendRequests:friendRequests}); 
        return;
      }
    }
    
    friendRequests.push(userData);
    friendRequests = JSON.parse(JSON.stringify(friendRequests));
    this.setState({friendRequests:friendRequests});
  }

  acceptFriendRequest(item){
    firebase.analytics().logEvent("friend_request_accepted");
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

    this.initFriendsList();
    this.setState({flipToRefresh:!this.state.flipToRefresh});


  }

  removeFriendRequest(item){
    firebase.analytics().logEvent("friend_request_deleted");
    let userid = firebase.auth().currentUser.uid;
    let database = firebase.database();
    let requestRef = database.ref('Users/' + userid+'/friendRequests/'+item.userid);
    requestRef.remove();

    let requestSentRef = database.ref('Users/' + item.userid+'/requestsSent/'+userid);
    requestSentRef.remove();

    this.initFriendsList();
    this.setState({flipToRefresh:!this.state.flipToRefresh});
    
    // //console.log(this.state.addedUsers);
  }

  _onPressRow(item){
    //console.log('row pressed')
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

  _resetScreen(){
    // let state = this.state;
    // let navParams = this.props.navigation.state.params;
    // navParams = {};
    // state.textInputValue = '';
    // state.planName ='I want to...';
    // state.groupName = 'All Friends';
    // state.currentUser={};
    // state.friendInfo = [];
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'AddedMe'})
      ]
    })
    this.props.navigation.dispatch(resetAction);


    // this.initUser();
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

  avatar:{
    height:height*0.047,
    width:height*0.047,
    borderRadius:(height*0.047)/2,
    // marginLeft:10,
    marginRight:10,
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

  listItem:{ 
    borderBottomWidth: 1, 
    height:height*0.07, 
    justifyContent:'center', 
  },

  // avatarIcon:{

  // }

  buttonRow:{
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'flex-end',
  },

  backButton:
  { 
    marginLeft:10,
    marginTop:10,
    height:30,
    width:30,
    alignSelf:'flex-start'
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


  
});