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
export default class AddMore extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  }

  constructor() {
      super();

      this.state = {
          text: '',
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriendsCopy','groupName','invitedFriendNames','invitedGroupNames','previouslyAdded','planId'],
          loading: false,
          data: [],
          page: 1,
          seed: 1,
          error: null,
          refreshing: false,
          invitedFriendsCopy : {},
          friendInfo : [],
          invitedFriendNames:{},

      }
  }
  componentDidMount() {
    // this.makeRemoteRequest();
    //console.log("reached");


    let state = this.state;
    
    // state.friendInfo = this._navPropOrDefault('friendInfo',[]);
    
    state.friendInfo = []
    state.invitedFriendNames = this._navPropOrDefault('invitedFriendNames',{})
    state.invitedFriendsCopy = {}
    state.previouslyAdded = this._navPropOrDefault('previouslyAdded',{})
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

/*{this._navPropOrDefault('invitedFriendsCopy',{})[item.userid] ? (
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
        <View style = {{height:height*.02}}>

        </View>

        <View style = {styles.textBox}>
        <Text style={styles.submitText} numberOfLines = {1}>
            Add
            <Text style = {{fontWeight:'bold', color:'#f9264f', marginLeft:100, height: height*0.035}} numberOfLines = {1}>
              {' '} { Object.values(this.state.invitedFriendNames).join(', ') }
            </Text>
          </Text>
        </View>

        <View style = {styles.quickSelect}>
          
          <FlatList
            data={this._navPropOrDefault('friendInfo',[])}
            extraData={this.state.invitedFriendsCopy}
            renderItem={({ item }) => (
              
              <ListItem
                  roundAvatar
                  title={item.fullname}
                  // subtitle={item.username}
                  avatar={ item.photoURL ? { uri: item.photoURL } :
                    require('./../icons/ProfileFinal.png')

                  }
                  containerStyle={{ borderBottomWidth: 1 }}
                  onPress = {this._onPressRow.bind(this, item)}
                  underlayColor = "rgba(255,255,255,0.1)"
                  rightIcon = {this.state.invitedFriendsCopy[item.userid] ?
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

       
        </View>

        <View style = {styles.end}>
          <View style = {styles.row}>
            <TouchableHighlight
              style={styles.cancelButton}
              // onPress={() => this.submitSuggestion(this.props)}
              onPress={()=>{firebase.analytics().logEvent("add_more_canceled");goBack()}}
              underlayColor="rgba(255,255,255,0.1)">
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={styles.acceptButton}
              // onPress={() => this.submitSuggestion(this.props)}
              onPress={()=>this._inviteFriends(this.state.invitedFriendsCopy, this._navPropOrDefault('planId',{}))}
              underlayColor="rgba(255,255,255,0.1)">
              <Text style={styles.acceptText}>
                Accept
              </Text>
            </TouchableHighlight>

          </View>

        </View>

      </LinearGradient>
    );
  }

  _onPressRow = (user) => {
    //console.log(user);



    if(!this.props.navigation.state.params.invitedFriendsCopy){
      this.props.navigation.state.params.invitedFriendsCopy = {};
    }
    
    let alreadyInvited = this.state.invitedFriendsCopy[user.userid];
    let invitedFriendsCopy = JSON.parse(JSON.stringify(this.state.invitedFriendsCopy));
    console.log(invitedFriendsCopy);
    let invitedFriendNames = this.state.invitedFriendNames || {};
    invitedFriendsCopy[user.userid] = !alreadyInvited;
    if(!alreadyInvited){
      invitedFriendNames[user.userid] = user.fullname;
    }
    else{
      delete invitedFriendNames[user.userid];
    }
    console.log(invitedFriendsCopy);
    this.props.navigation.state.params.invitedFriendsCopy[user.userid] = invitedFriendsCopy[user.userid];
    this.setState({invitedFriendsCopy:invitedFriendsCopy, invitedFriendNames:invitedFriendNames});
    this.printState();

    // this.props.navigation.navigate('Home',this._getAcceptParameters({planName:text}));
  }

  _navPropOrDefault = (propName,defaultName) => {
    //console.log(((this.props.navigation.state.params && this.props.navigation.state.params[propName]) ? this.props.navigation.state.params[propName] : defaultName));
    return ((this.props.navigation.state.params && this.props.navigation.state.params[propName]) ? this.props.navigation.state.params[propName] : defaultName);
  }

  _isFriendInvited = (userid) => {
    //console.log("userid passed: ", userid);
    let invitedFriendsCopy = this._navPropOrDefault('invitedFriendsCopy',{});
    return invitedFriendsCopy[userid];

  }

  _inviteFriends(friends, planId){
    firebase.analytics().logEvent("friends_added");
    console.log(friends)
    console.log(planId)
    if(!friends || !planId){
      return;
    }
    let database = firebase.database();
    for (let userid of Object.keys(friends)){
      let userPlansRef = database.ref('Users/'+userid+'/invited/');
      let addPlan = {};
      addPlan[planId] = planId;
      userPlansRef.update(addPlan);

      let planRef  = database.ref('Plans/' + planId + '/invitedFriends/');
      let addUser = {};
      addUser[userid] = userid;
      planRef.update(addUser);
    }
    const { navigate,goBack } = this.props.navigation;
    goBack();

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
    console.log(this.state.previouslyAdded)
    console.log(this._navPropOrDefault('invitedFriendsCopy',''))
    let userid =  firebase.auth().currentUser.uid;
    //console.log("current uid: " + userid)
    firebase.database().ref('Users/' + userid).once('value').then((snapshot) => {
      // //console.log("state in firebase promise: ", this.state);

      var userData = snapshot.val();
      let currentUser = new User(userData.fullname,userData.username,userData.email,userData.phonenumber, userData.userid, userData.photoURL, userData.currentFriends);

      let state = this.state;
      state.currentUser = currentUser;
      this.setState(state);

      if(!this.props.navigation.state.params){
       this.props.navigation.state.params = {};
      }

      this.props.navigation.state.params['currentUser'] = currentUser;

      //Now update the info about current friends
      let currentFriends = currentUser.currentFriends;
      // this.props.navigation.state.params['invitedFriendsCopy'] = this._navPropOrDefault('invitedFriendsCopy',currentFriends);


      state.friendInfo = [];
      state = JSON.parse(JSON.stringify(state));

      if(currentFriends && Object.values(currentFriends).length === 0){
        this.setState(state);
      }

      if(!currentFriends){
        return;
      }
      for(let friend of Object.values(currentFriends)){
        if(this.state.previouslyAdded[friend] || (this._navPropOrDefault('invitedFriendsCopy',{})[friend])){
          // console.log(this.state.previouslyAdded[friend])
          // console.log(this._navPropOrDefault('invitedFriendsCopy',{})[friend]);
          // console.log("reached");
          continue;
        }
        firebase.database().ref('Users/' + friend).once('value').then((snapshot) => {

          var userData = snapshot.val();
          //console.log(userData);
          let state = this.state;
          let friendUser = new User(userData.fullname,userData.username,userData.email,userData.phonenumber, userData.userid, userData.photoURL, userData.currentFriends);   
          if(!state.friendInfo){
            state.friendInfo = [];
          }
          state.friendInfo.push(friendUser);
          state.friendInfo = JSON.parse(JSON.stringify(state.friendInfo));
          state.invitedFriendsCopy = JSON.parse(JSON.stringify(state.invitedFriendsCopy));
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