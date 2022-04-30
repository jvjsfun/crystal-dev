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
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';

import { Button, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';

var {height, width} = Dimensions.get('window');
//(text)=>this.setState({text})
export default class Plan extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  }
  constructor() {
      super();

      this.state = {
          text: false,
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames','planId','planDate','dateEpoch','location','previousScreen','returnKey','invitedGroupNames','invitedGroups','selectionType','planId','timeType','timeString',],
          previousScreen:"Home",
      }
  }

  renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            backgroundColor: "#CED0CE",
          }}
        />
      );
    };

  componentWillMount(){
    this.state.previousScreen = this._navPropOrDefault('previousScreen','Home');
    // console.log(this.props.navigation);
  }

  render() {
    const { navigate } = this.props.navigation;
  
    return (
      <LinearGradient colors = {['#f9264f', '#331010']} style = {{flex:1}}>
        <StatusBar barStyle = "light-content"/>
        <View style = {{height:height*.04}}>

        </View>

        
        <TextInput
          autoGrow = {false}
          style={styles.submitPlan}
          underlineColorAndroid='transparent'
          // onPress={() => this.submitSuggestion(this.props)}
          autoFocus = {true}
          placeholder = 'I want to...'
          placeholderTextColor= '#a8a8a8'
          returnKeyType = {'done'}
          autoCapitalize = 'sentences'
          maxLength = {20}
          underlayColor='#fff'
          onChangeText={(text) => this.setState({text})}
          value={this.state.text !== false ? this.state.text : ((this.props.navigation.state.params && this.props.navigation.state.params.planName) ? this.props.navigation.state.params.planName : '')}
          onSubmitEditing = {()=>this.setCustomPlanName()}
        >
          
        </TextInput>

       

        
          <SectionList
            style = {styles.quickSelect}
            keyboardShouldPersistTaps = {"always"}
            keyboardDismissMode="on-drag"
            sections={[
              {title: 'Quick Select', data: ['Lunch', 'Dinner', 'Drinks', 'Chill', 'Go Out', 'Gym', 'Movie', 'Climbing']},
            ]}
            renderItem={({item}) => 
              <Text 
                numberOfLines = {1}
                style={styles.item}
                onPress = {this._onPressRow.bind(this, item)
                }
              >
                {item}
              </Text>

              
            }
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => index}
            ItemSeparatorComponent = {this.renderSeparator}
            SectionSeparatorComponent = {this.renderSeparator}
          />
          <KeyboardAvoidingView style = {{backgroundColor:'#4c1319', justifyContent:'flex-end'}} behavior = 'position'>
            <TouchableHighlight
              style={styles.cancelButton}
              // onPress={() => this.submitSuggestion(this.props)}
              onPress={() => navigate(this.state.previousScreen,this._passNavParameters())}
              underlayColor="rgba(255,255,255,0.1)">
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableHighlight>

          </KeyboardAvoidingView>
        </LinearGradient>

      
    );
  }

  setCustomPlanName(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("custom_plan_name",{planName:this.state.text});
    navigate(this.state.previousScreen,this._getAcceptParameters({planName:this.state.text}));
  }
  _onPressRow(text){
    firebase.analytics().logEvent("default_plan_name", {planName:text});
    this.setState({text:text});

    this.props.navigation.navigate(this.state.previousScreen,this._getAcceptParameters({planName:text}));
  }

  _navPropOrDefault(propName,defaultName){
    return ((this.props.navigation.state.params && this.props.navigation.state.params[propName]) ? this.props.navigation.state.params[propName] : defaultName);
  }

  _getAcceptParameters(paramObject){
    let parameters = this._passNavParameters();
    for(let param in paramObject){
      parameters[param] = paramObject[param];
    }
    return parameters;
  }

   _passNavParameters(){
    let parameters = {};
    for (i in this.state.navParameters){
      let param = this.state.navParameters[i];
      parameters[param] = this._navPropOrDefault(param,'');
    }
    return parameters;

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

  header: {
    fontSize: 20,
    marginVertical: 20,
  },
 submitPlan:{
    marginRight:height*0.018,
    marginLeft:height*0.018,
    height:height*0.118,
    paddingLeft:20,
    justifyContent:'center',
    backgroundColor:'#fff',
    borderRadius:7.5,
    borderWidth: 1,
    borderColor: '#fff',
    fontSize:height*0.035,
  },
  submitPlanText:{

      marginLeft:20,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:height*0.035
  },

  

  quickSelect:{
    borderRadius:7.5,
    // height:height*0.8,
    flex:1,
    marginTop : height*0.018,
    marginBottom:height*0.018,
    backgroundColor:'#fff',
    marginRight:height*0.018,
    marginLeft:height*0.018,

  },


  
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: height*0.019,
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
    marginLeft:height*0.018,
  },

  cancelButton:{
    height:height*0.08,
    width:width,
    // marginLeft:20,
    // marginRight:20,
    backgroundColor:'#f9f9f9',
    // flex:1,
    alignItems:'center',
    justifyContent:'center',
  },

  cancelText:{
    fontSize:30,
    textAlign:'center',
    color:'#f9264f',
  },

});