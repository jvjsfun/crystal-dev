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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';


//If you are wondering why this isn't working. Try bumping back the version of the library.


var counter = 0;
var {height, width} = Dimensions.get('window');
export default class LocationPicker extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  }
  constructor() {
      super();

      this.state = {
          text: '',
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames','invitedGroups','returnKey','invitedGroupNames','planId','selectionType','timeType','timeString',],
          predefinedPlaces:[{description:"My place"}],
          keyboardVisible:true,
          showPredefinedPlaces:false,
          listViewDisplayed:true,
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
    let previousScreen = this._navPropOrDefault('previousScreen',"Home");
    this.setState({previousScreen:previousScreen});
  }

  render() {
    const { navigate } = this.props.navigation;
    
    return (
      // <View style = {{height:height, width:width, backgroundColor:'#4c1319'}}>
      <LinearGradient colors = {['#f9264f', '#331010']} style = {{flex:1}}>
        <StatusBar barStyle = "light-content"/>
        <GooglePlacesAutocomplete
          placeholder='Location'
          minLength={1} // minimum length of text to search
          autoFocus={true}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed={this.state.listViewDisplayed}    // true/false/undefined
          fetchDetails={true}
          isRowScrollable = {false}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            if(data.description){
              if(data.description === "My place"){
                firebase.analytics().logEvent("predefined_location_selected", {location : data.description})  
              }
              else{
                firebase.analytics().logEvent("location_selected", {location : data.description})
              }
              console.log(this._navPropOrDefault('invitedFriends',''));
              navigate(this.state.previousScreen,this._getAcceptParameters({location:data.description}))
            }

          }}
          predefinedPlacesAlwaysVisible = {false}
          predefinedPlaces = {this.state.predefinedPlaces}
          getDefaultValue={() => ''}
          
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyCpWoAr7hNFt4vCIBW9Zk4a9EeQkb-rGqE',
            language: 'en', // language of the 
          }}
          
          styles={{
            textInputContainer: {
              marginTop:25,
              marginRight:10,
              marginLeft:10,
              alignItems:'center',
              justifyContent:'center',
              backgroundColor:'#fff',
              height:height*0.118,
              borderRadius:7.5,
              
            },
            textInput:{
              fontSize:height*0.035,
              height:height*0.1,
              paddingLeft:20,
            },
            listView:{
              marginTop:10,
              marginBottom:10,
              // height:height/3,
              // marginBottom:10,
              backgroundColor:'#fff',
              borderRadius:7.5,
              marginRight:10,
              marginLeft:10,
            },
            container:{
              backgroundColor:'transparent',
              // height:height*0.45,
              flex:1,
            },
            description: {
              fontWeight: 'bold',
              color:'#fd2744'
            },
            predefinedPlacesDescription: {
              color: '#fd2744'
            }
          }}
          
          currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
          // currentLocationLabel={this.state.text}
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            
          }}



          textInputProps = {{
            onChangeText : (text)=>this._setStateToText(text),
            // onChangeText:(text) => this._setPredefinedPlaceToText(text),
            onFocus:()=>{return true},
            returnKeyType : 'done',
            onSubmitEditing : ()=>this.acceptCustomLocation()
            // returnKeyType:'done',
          }}
      

          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        >

          <KeyboardAvoidingView style = {{backgroundColor:'#4c1319', justifyContent:'flex-end'}} behavior = 'position'>
            <TouchableHighlight
              style={styles.cancelButton}
              // onPress={() => this.submitSuggestion(this.props)}
              onPress={() => this.cancel()}
              underlayColor="rgba(255,255,255,0.1)">
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableHighlight>

          </KeyboardAvoidingView>

        </GooglePlacesAutocomplete>
        </LinearGradient>
        
      // </View>

       
    );
  }

  acceptCustomLocation(){
    console.log(this._navPropOrDefault('invitedFriends',''));
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("custom_location_accepted",{location:this.state.text});
    navigate(this.state.previousScreen,this._getAcceptParameters({location:this.state.text}))    
  }

  cancel(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("location_canceled");
    navigate(this.state.previousScreen,this._passNavParameters());
  }

  



  _setStateToText(text){

    let state = this.state;
    state.text = text;
    this.setState(state);
  }

  _setPredefinedPlaceToText(text){
    // console.log(text);
    let state = this.state;
    
    
    if(text === ""){
      state.predefinedPlaces.push({description:text})
      // this.setState({listViewDisplayed:false});
    }
    else{
      state.predefinedPlaces = [];
    }
    
    // state.listViewDisplayed = true;
    this.setState(state);
    
    // //console.log(this.state);
  }

  _navPropOrDefault(propName,defaultName){
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
  submit:{
    marginLeft:10,
    color:'#f9264f',
    textAlign:'left',
    fontSize:20
  },

  textBox:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'#fff',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
  },

  quickSelect:{
    borderRadius:10,
    height:height*0.8,
    marginTop : 10,
    backgroundColor:'#fff',
    marginRight:20,
    marginLeft:20,
  },


  submitText:{

      marginLeft:10,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:20
  },

  acceptButton:{
    height:height*0.09,
    backgroundColor:'#f9264f',
    width: width,
    alignItems:'center',
    justifyContent:'center',
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
    fontSize: 18,
    height: 44,
    color: '#f9264f',
    marginLeft:width/20,
  },

});