import React, { Component } from 'react';
import {
  // Button,
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions,
  SectionList,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import firebase from 'react-native-firebase';
import User from '../helper/User.js';
import { Button, Icon, List, ListItem, SearchBar, CheckBox } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

var {height, width} = Dimensions.get('window');
//(text)=>this.setState({text})

/*
Schema for groups in database.
  [User]
    groups
      [GroupId]
        groupName
        friendsInGroup

This page:
  List of groups with checkboxes next to them
  Edit groups button
  Select friends individually button

*/


export default class SelectGroups extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  }

  constructor() {
      super();

      this.state = {
          text: '',
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','groupName','planId','planDate','dateEpoch','location','previousScreen','returnKey','invitedGroupNames','invitedGroups','selectionType','groupInfo','planId','timeType','timeString',],
          loading: false,
          data: [],
          page: 1,
          seed: 1,
          error: null,
          refreshing: false,
          invitedFriends : {},
          friendInfo : [],
          invitedFriendNames:{},
          invitedGroupNames:{},
          invitedGroups:{},
          loaded:false,
      }
  }

  componentDidMount() {
    let groupsRef = firebase.database().ref("Users/"+firebase.auth().currentUser.uid+"/groups");
    groupsRef.on("child_added", (snapshot) => {
      if(this.state.loaded)
        this.refreshCurrentUserData();
    });
    groupsRef.on("child_removed", (snapshot) => {
      if(this.state.loaded)
        this.refreshCurrentUserData();
    });

    let state = this.state;

    state.groupInfo = this._navPropOrDefault('groupInfo',[]);
    if(state.groupInfo.length === 0){
      state.groupInfo.push({
        groupName:'Edit Groups',
        groupType:'edit',
        groupId:'Edit Groups'
      });
    }
    
    state.invitedGroupNames = this._navPropOrDefault('invitedGroupNames',{})
    state.invitedGroups = this._navPropOrDefault('invitedGroups',{})

    if(!this._navPropOrDefault('returnKey',false)){
      this.props.navigation.state.params.returnKey = this.props.navigation.state.key;
    }

    this.setState(state);

    this.refreshCurrentUserData();

  }

  componentWillUnmount(){
    let groupsRef = firebase.database().ref("Users/"+this.state.currentUser.userid+"/groups");
    groupsRef.off("child_added");
    groupsRef.off("child_removed");
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

  refreshCurrentUserData = () => {
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
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
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

/*{this._navPropOrDefault('invitedFriends',{})[item.userid] ? (
                      <Image source={require('./../icons/Select1.png')} 
                    style={{width: height/7, height: height/7, borderRadius:height/14}}/>

                    ) 
                    : 
                    (
                      <Image source={require('./../icons/Select0.png')} 
                    style={{width: height/7, height: height/7, borderRadius:height/14}}/>

                    )


                }*/

  render() {

    //console.log("render called");
    const { navigate,goBack } = this.props.navigation;
  
    return (
      <LinearGradient colors = {['#f9264f', '#331010']} style = {{flex:1}}>
        <StatusBar barStyle = "light-content"/>
      
        <View style = {{height:height*.02}}/>

        <View style = {styles.textBox}>
          <Text style={styles.submitText} numberOfLines = {1}>
            With
            <Text style = {{fontWeight:'bold', color:'#f9264f', marginLeft:100}} numberOfLines = {1}>
              {' '} { Object.values(this.state.invitedGroupNames).join(', ')}
            </Text>
          </Text>
        </View>

        <View style = {styles.quickSelect}>

          <FlatList
            data={this.state.groupInfo}
            extraData={this.state.invitedGroupNames}
            renderItem={({ item }) => (
            <TouchableHighlight onPress = {this._onPressRow.bind(this, item)} underlayColor = "rgba(255,255,255,0.9)" style = {styles.divider}>
              <View style = {{flexDirection:'row', alignItems:'center'}}>
               <Text
                  numberOfLines = {1}
                  style={[styles.item, item.groupType === 'edit' ? {color:'gray'} : {}]}
                  onPress = {this._onPressRow.bind(this, item)}
                >
                  {item.groupName}
                </Text>

                <View style = {{flexDirection:'row',flex:1}}/>
                {this.renderCircle(item)}
              </View>

            </TouchableHighlight>
                

            )}
            keyExtractor={item => {
              console.log(item);
              console.log(item.groupId);
              return item.groupId;
            }}
            // ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
          <View style = {styles.divider}/>
          <Text
            style={[styles.item, {color:'gray', fontSize:height*0.0325, textAlign:'left'}]}
            onPress = {()=>this.goToIndividual()}
          >
            {"Select Friends Individually >"}
          </Text>
       
        </View>

        {this.renderAcceptCancelButtons()}

      
      </LinearGradient>
    );
  }

  isChoiceMade(){
    return Object.values(this.state.invitedGroupNames).length > 0;
  }

  renderCircle(item){
    // console.log("rendering")
    if(item.groupType !== 'standard'){
      return;
    }
    return(
      
        <Image 
          source = {this.state.invitedGroups[item.groupId] ?
            require('./../icons/Select1.png') :
            require('./../icons/Select0.png')} 
          style={{width: height/20, height: height/20, borderRadius:height/40, marginRight:10}} 
        />
      
    );
  }

  renderAcceptCancelButtons(){
    const { navigate, goBack } = this.props.navigation;
    if(this.isChoiceMade()){
      return(
        <View style = {styles.end}>
          <View style = {styles.row}>
            <TouchableHighlight
              style={styles.cancelButton}
              // onPress={() => this.submitSuggestion(this.props)}
              onPress={() => this.cancel()}
              underlayColor="rgba(255,255,255,0.1)">
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.acceptButton}
              // onPress={() => this.submitSuggestion(this.props)}
              onPress={()=>this.accept()}
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
        <View style = {styles.row}>
          <TouchableHighlight
            style={[styles.cancelButton,{width:width}]}
            // onPress={() => this.submitSuggestion(this.props)}
            onPress={() => this.cancel()}
            underlayColor="rgba(255,255,255,0.1)">
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </TouchableHighlight>

        </View>
      </View>
    );

  }


  accept(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("group_choice_accepted");
    navigate('Home',this._getAcceptParameters({groupName: Object.values(this.state.invitedGroupNames).join(', '), invitedGroupNames:this.state.invitedGroupNames, invitedGroups:this.state.invitedGroups, selectionType:'group'}))
  }
  cancel(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("group_choice_canceled");
    goBack(this._navPropOrDefault('returnKey',''))
  }

  goToIndividual(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("select_individually");
    navigate('WithFriends', this._passNavParameters())
  }

  _onPressRow = (group) => {

    const { navigate, goBack } = this.props.navigation;
    if(group.groupType === 'All Friends'){
      this.selectAllFriends();
    }

    if(group.groupType === 'edit'){
      navigate('MyFriends',this._passNavParameters());
    }

    else if(group.groupType === 'standard'){
      if(!this.props.navigation.state.params.invitedGroupNames){
        this.props.navigation.state.params.invitedGroupNames = {};
      }

      let invitedGroupNames = this.state.invitedGroupNames;
      let invitedGroups = this.state.invitedGroups;
      let alreadyInvited = invitedGroupNames[group.groupName];
      invitedGroupNames[group.groupName] = !alreadyInvited;
      if(!alreadyInvited){
        invitedGroupNames[group.groupName] = group.groupName;
        invitedGroups[group.groupId] = group.groupId;
      }
      else{
        delete invitedGroupNames[group.groupName];
        delete invitedGroups[group.groupId];
      }
      // console.log(invitedGroupNames);

      this.setState({invitedGroupNames:JSON.parse(JSON.stringify(invitedGroupNames)), invitedGroups:invitedGroups});
    }
    // this.printState();

    // this.props.navigation.navigate('Home',this._getAcceptParameters({planName:text}));
  }

  _navPropOrDefault = (propName,defaultName) => {
    //console.log(((this.props.navigation.state.params && this.props.navigation.state.params[propName]) ? this.props.navigation.state.params[propName] : defaultName));
    return ((this.props.navigation.state.params && this.props.navigation.state.params[propName]) ? this.props.navigation.state.params[propName] : defaultName);
  }

  _isFriendInvited = (userid) => {
    //console.log("userid passed: ", userid);
    let invitedFriends = this._navPropOrDefault('invitedFriends',{});
    return invitedFriends[userid];

  }

  _getAcceptParameters = (paramObject) => {
    let parameters = this._passNavParameters();
    for(let param in paramObject){
      parameters[param] = paramObject[param];
    }
    return parameters;
  }

   _passNavParameters = () => {
    let parameters = {};
    for (i in this.state.navParameters){
      let param = this.state.navParameters[i];
      parameters[param] = this._navPropOrDefault(param,'');
    }
    return parameters;

  }

  selectAllFriends(){
    const { navigate } = this.props.navigation;
    navigate('Home',this._getAcceptParameters({groupName: 'All Friends', invitedGroupNames:['All Friends'], selectionType:'group'}));
  }

  printState = () => {
    //console.log(this.state);
    //console.log(this.props.navigation.state.params);
    // //console.log(this._navPropOrDefault('friendInfo',''));
  }


  refreshCurrentUserData = () => { 
    //console.log("triple reached");
    //console.log("state in getCurrentUserData: ", this.state);
    let userid =  firebase.auth().currentUser.uid;
    //console.log("current uid: " + userid)
    firebase.database().ref('Users/' + userid).once('value').then((snapshot) => {
      // //console.log("state in firebase promise: ", this.state);

      var userData = snapshot.val();
      let currentUser = userData;

      let state = this.state;
      state.currentUser = currentUser;
      this.setState(state); 

      if(!this.props.navigation.state.params){
       this.props.navigation.state.params = {};
      }

      this.props.navigation.state.params['currentUser'] = currentUser;

      //Now update the info about current friends
      let currentFriends = currentUser.currentFriends;
      // this.props.navigation.state.params['invitedFriends'] = this._navPropOrDefault('invitedFriends',currentFriends);


      state.groupInfo = [];
      state = JSON.parse(JSON.stringify(state));
      state.loaded = true;

      if(currentFriends && Object.values(currentFriends).length === 0){
        this.setState(state);
      }

      //All friends button
      state.groupInfo.push({
        groupName:'All Friends',
        groupType:'All Friends',
        groupId:'All Friends',
      });

      if(currentUser.groups){

        for(let group of Object.values(currentUser.groups)){
          group.groupType = 'standard';
          state.groupInfo.push(group);
          // firebase.database().ref('Users/' + friend).once('value').then((snapshot) => {

          //   var userData = snapshot.val();
          //   //console.log(userData);
          //   let state = this.state;
          //   // let friendUser = new User(userData.fullname,userData.username,userData.email,userData.phonenumber, userData.userid, userData.photoURL, userData.currentFriends);   
          //   if(!state.groupInfo){
          //     state.groupInfo = [];
          //   }
          //   state.groupInfo.push(group);
          //   state.groupInfo = JSON.parse(JSON.stringify(state.groupInfo));
          //   state.invitedGroupNames = JSON.parse(JSON.stringify(state.invitedGroupNames));
          //   this.props.navigation.state.params.groupInfo = state.groupInfo;
          //   this.setState(state);
          //   this.printState();
          // });

        }
        
      }

      //Edit groups button
      state.groupInfo.push({
        groupName:'Edit Groups',
        groupType:'edit',
        groupId:'Edit Groups',
      });
      console.log(state.groupInfo);
      this.setState(state);
      
    });
  }


}
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#4c1319',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    //marginTop:
  },

  divider:{
    borderBottomColor:'#e4e4e4',
    borderBottomWidth:1,
  },

  endRow:{
    // flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    backgroundColor:'transparent',
  },
 end:{
    // flex:1,
    justifyContent:'flex-end',
  },

  row:{
    marginTop:10,
    flex:0,
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',

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
    // flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  acceptText:{
    fontSize:30,
    textAlign:'center',
    color:'#fff',
  },



  header: {
    fontSize: 20,
    marginVertical: 20,
  },
  submit:{
    marginLeft:10,
    color:'#f9264f',
    textAlign:'left',
    fontSize:20
  },

  textBox:{
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    height:height*0.118,
    justifyContent:'center',
    backgroundColor:'#fff',
    borderRadius:7.5,
    backgroundColor:'#fff',
    borderWidth: 1,
    borderColor: '#fff',
  },

  quickSelect:{
    borderRadius:7.5,
    // height:height*0.69,
    flex : 1,
    marginTop : 10,
    backgroundColor:'#fff',
    marginRight:10,
    marginLeft:10,
  },

  submitText:{

      marginLeft:20,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:height*0.035
  },

  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f9264f',
    borderBottomWidth:1,
    borderBottomColor:"#CED0CE",
  },
  item: {
    borderRadius:5,
    // borderColor:'#efefef',
    borderColor:'#f9264f',
    padding: 10,
    fontSize: height*0.035,
    fontWeight:'bold',
    // height: 44,
    color: '#f9264f',
    marginLeft:height*0.015,
    marginRight:height*0.015,
  },

});