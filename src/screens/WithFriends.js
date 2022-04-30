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
//TODO: Add refresh
export default class WithFriends extends Component {
  static navigationOptions = {
        gesturesEnabled: false
  }

  constructor() {
      super();

      this.state = {
          text: '',
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames','returnKey','selectionType','individuallyInvitedFriends','groupInfo','planId','timeType','timeString',],
          loading: false,
          data: [],
          page: 1,
          seed: 1,
          error: null,
          refreshing: false,
          invitedFriends : {},
          friendInfo : [],
          invitedFriendNames:{},

      }
  }
  componentDidMount() {
    // this.makeRemoteRequest();
    //console.log("reached");

    // console.log(this._navPropOrDefault('returnKey',"FAFEF"));
    if(!this._navPropOrDefault('returnKey',false)){
      this.props.navigation.state.params.returnKey = this.props.navigation.state.key;
    }
    let state = this.state;
    
    state.friendInfo = this._navPropOrDefault('friendInfo',[]);
    
    state.invitedFriendNames = this._navPropOrDefault('invitedFriendNames',{})
    state.invitedFriends = this._navPropOrDefault('invitedFriends',{})
    this.setState(state);

    //console.log("double reached");
    this.refreshCurrentUserData();

    this.printState();


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
    const { navigate, goBack } = this.props.navigation;
  
    return (
      <LinearGradient colors = {['#f9264f', '#331010']} style = {{flex:1}}>
        <StatusBar barStyle = "light-content"/>
        <View style = {{height:height*.02}}>

        </View>

        <View style = {styles.textBox}>
          <Text style={styles.submitText} numberOfLines = {1}>
            With
            <Text style = {{fontWeight:'bold', color:'#f9264f', marginLeft:100, height: height*0.035}} numberOfLines = {1}>
              {' '} { Object.values(this.state.invitedFriendNames).join(', ') }
            </Text>
          </Text>
        </View>

        <View style = {styles.quickSelect}>
          
          <FlatList
            data={this._navPropOrDefault('friendInfo',[])}
            extraData={this.state.invitedFriends}
            renderItem={({ item }) => (
              
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
                  rightIcon = {this.state.invitedFriends[item.userid] ?
                    <Image source={require('./../icons/Select1.png')} style={{width: height/20, height: height/20, borderRadius:height/40}}/> :
                    <Image source={require('./../icons/Select0.png')} style={{width: height/20, height: height/20, borderRadius:height/40}}/>
                  }
                  />

            )}
            keyExtractor={item => item.userid}
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
            onPress = {()=>this.goToGroups()}
          >
            {"< Groups"}
          </Text>

        </View>

        {this.renderAcceptCancelButtons()}

      </LinearGradient>
    );
  }

  isChoiceMade(){
    return(Object.values(this.state.invitedFriendNames).length > 0);
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
              onPress={() => this.accept()}
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
    firebase.analytics().logEvent("individual_choice_selected");
    console.log(this._getAcceptParameters({selectionType:'individual', invitedFriends:this.state.invitedFriends, invitedFriendNames:this.state.invitedFriendNames, groupName:Object.values(this.state.invitedFriendNames).join(', ')}))
    navigate('Home',this._getAcceptParameters({selectionType:'individual', invitedFriends:this.state.invitedFriends, invitedFriendNames:this.state.invitedFriendNames, groupName:Object.values(this.state.invitedFriendNames).join(', ')}))
  }

  cancel(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("individual_choice_canceled");
    goBack(this._navPropOrDefault('returnKey',''))
  }

  goToGroups(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("back_to_groups");
    navigate('SelectGroups', this._passNavParameters())
  }

  _onPressRow = (user) => {
    //console.log(user);
    
    if(!this.props.navigation.state.params.invitedFriends){
      this.props.navigation.state.params.invitedFriends = {};
    }

    let state = JSON.parse(JSON.stringify(this.state)); //Deep copies are needed for the list to refresh kms
    let alreadyInvited = state.invitedFriends[user.userid];
     
    if(!alreadyInvited){
      state.invitedFriendNames[user.userid] = user.fullname;
      state.invitedFriends[user.userid] = user.userid
    }
    else{
      delete state.invitedFriendNames[user.userid];
      delete state.invitedFriends[user.userid];
    }
    this.props.navigation.state.params.invitedFriends[user.userid] = state.invitedFriends[user.userid];
    this.setState(state);
    this.printState();

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
      // let currentUser = new User(userData.fullname,userData.username,userData.email,userData.phonenumber, userData.userid, userData.photoURL, userData.currentFriends);
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


      state.friendInfo = [];
      state = JSON.parse(JSON.stringify(state));
      if(Object.values(currentFriends).length === 0){
        this.setState(state);
      }
      for(let friend of Object.values(currentFriends)){
        firebase.database().ref('Users/' + friend).once('value').then((snapshot) => {

          var userData = snapshot.val();
          //console.log(userData);
          let state = this.state;
          let friendUser = new User(userData.fullname,userData.username,userData.email,userData.phonenumber, userData.userid, userData.photoURL, userData.currentFriends);   
          if(!state.friendInfo){
            state.friendInfo = [];
          }


          let userAdded = false;
          for(let friend of state.friendInfo){
            if(friend.userid === friendUser.userid){
              userAdded = true;
              break;
            }
          }

          if(!userAdded){
            state.friendInfo.push(friendUser);
          }

          state.friendInfo = JSON.parse(JSON.stringify(state.friendInfo));
          state.invitedFriends = JSON.parse(JSON.stringify(state.invitedFriends));
          this.props.navigation.state.params.friendInfo = state.friendInfo;
          this.setState(state);
          this.printState();
          

        });
      }
      
    });
  }


}
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c1319',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    //marginTop:
  },


  endRow:{
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    backgroundColor:'transparent',
  },
 
  end:{
    // flex:1,
    justifyContent:'flex-end',
  },

  divider:{
    borderBottomColor:'#e4e4e4',
    borderBottomWidth:1,
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
    width:width/2,
    // flex:1,
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
    backgroundColor:'#f9264f',
    width:width/2,
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
    flex:1,
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