import React, { Component } from 'react';
import {
  // Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions,
  SectionList,
  Picker,
  StatusBar,
} from 'react-native';
import TimePicker from './TimePicker'

import { Button, Icon } from 'react-native-elements'
import { CalendarList} from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import firebase from 'react-native-firebase';

// import {Picker} from 'react-native-wheel-picker';
// var PickerItem = Picker.Item;
//TODO: Unfuckup spacing
var {height, width} = Dimensions.get('window');


export default class DateTimePicker extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  }

  constructor() {
      super();
      let markedDates = new Object();
      let rightNow = new Date();
      let month = ("0"+(rightNow.getMonth()+1)).slice(-2);
      let day = ("0"+(rightNow.getDate())).slice(-2);
      let rightNowFormatted = rightNow.getFullYear()  + "-" + month + "-" + day;

      let todayAtMidnight = new Date();
      todayAtMidnight.setHours(0);
      todayAtMidnight.setMinutes(0);
      todayAtMidnight.setSeconds(0);
      // console.log(todayAtMidnight.getTime());
      // todayAtMidnight.setMilliseconds(0);
      //console.log(todayAtMidnight.getTime());




      //console.log(rightNowFormatted);
      markedDates[rightNowFormatted] = {selected:true};

      this.state = {
          text: 'Today',
          dateEpoch: this._getMinDate().getTime(),
          markedDates:markedDates,
          time:false,
          timeString:false,
          navParameters:['planName','dateName','dateEpoch', 'location', 'currentUser','friendInfo','invitedFriends','groupName','invitedFriendNames','planId','planDate','dateEpoch','location','previousScreen','invitedGroups','returnKey','invitedGroupNames','selectionType','timeType','timeString',],
          previousScreen:'Home',
          timeType:'specific',
          
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
  }

  render() {
    const { navigate } = this.props.navigation;
  
    return (
      <LinearGradient colors = {['#f9264f', '#331010']} style = {{flex:1}}>               
        <StatusBar barStyle = "light-content"/>
        <View style = {{height:height*.02}}>

        </View>

        <View style = {styles.textBox}>
          <Text
            style = {styles.submit}
          >
            {this.getDateString()}
          </Text>

        </View>

        <View style = {styles.quickSelect}>
          <View style = {styles.calendar}>
            <CalendarList
              // Specify style for calendar container element. Default = {}
              scrollEnabled = {true}
              minDate = {this.minCalendarMoment()} 
              style={{
                borderWidth: 0,
                borderColor: '#fff',
                // height: height*0.2,
                // marginRight:height*0.018,
                // marginLeft:height*0.018,
              }}
              // Specify theme properties to override specific styles for calendar parts. Default = {}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#f9264f',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#000000',
                dayTextColor: '#000000',
                textDisabledColor: '#d9e1e8',
                dotColor: '#00adf5',
                selectedDotColor: '#f9264f',
                arrowColor: '#f9264f',
                monthTextColor: '#f9264f',
                textDayFontSize: 18,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
                'stylesheet.calendar.main':{
                  week:{
                    marginTop:0,
                    marginBottom:0,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  },
                },

              }}
              hideExtraDays = {true}
              markedDates = {this.state.markedDates}
              onDayPress = {
                (dateObject) => this._onPressDate(dateObject)
              }

            />
          </View>
        </View>



        <TimePicker setTimeType = {(timeType)=>this.setTimeType(timeType)} setTime = {(timeData)=>this.setTime(timeData)} today = {this.state.text === 'Today'}  />

     

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
      </LinearGradient>
    );
  }

  getDateString(){

    switch(this.state.timeType){
      case 'specific':
        return this.epochToString(this.getDateEpoch());
        break;
      case 'vague':
        return this.epochToStringWithoutTime(this.state.dateEpoch) + this.state.timeString;

    }
  }

  accept(){
    let dateEpoch = this.getDateEpoch();
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("date_accepted",{dateChosen:dateEpoch, dateCreated:new Date().getTime()});
    let dateName = "";

    navigate(this.state.previousScreen,this._getAcceptParameters({dateName:this.getDateString(), dateEpoch: dateEpoch, time: this.state.time, timeType : this.state.timeType, timeString:this.state.timeString}))
  }

  cancel(){
    const { navigate, goBack } = this.props.navigation;
    firebase.analytics().logEvent("date_canceled");
    navigate(this.state.previousScreen,this._passNavParameters())
  }


  _getMinDate(){
    let date = new Date();
    if(date.getHours() === 23 && date.getMinutes() >= 30){
      date.setDate(date.getDate()+1);
      date.setHours(0);
    }
    // date.setHours(22);
    // console.log(date.getHours());
    return date;
    // date.setDate(date.getDate()-1);
  }

  setTime(timeData){
    console.log(timeData)
    if(timeData.type === "vague"){
      this.setState({timeString:timeData.timeString});
    }
    else if(!timeData){
      this.setState({time:false, timeString:false})
    }
    else{
      this.setState({time:timeData, timeString: this._pickerItemToString(timeData)})
    }
  }

  setTimeType(timeType){
    console.log(timeType);
    this.setState({timeType:timeType});
  }

  getDateEpoch(){
    // console.log(this.state.time);
    if(this.state.timeType === 'vague'){
      let selectedDate = new Date(this.state.dateEpoch);
      let minDate =  this._getMinDate();
      switch(this.state.timeString){
        case 'Now':
          return minDate.getTime();
          break;

        case 'Soon':
          minDate.setHours(minDate.getHours() + 1);
          return minDate.getTime();
          break;

        case 'Afternoon':
          selectedDate.setHours(13);
          selectedDate.setMinutes(0);
          return selectedDate.getTime();
          break;

        case 'Morning':
          selectedDate.setHours(9);
          selectedDate.setMinutes(0);
          return selectedDate.getTime();
          break;

        case 'Evening':
          selectedDate.setHours(18);
          selectedDate.setMinutes(0);
          return selectedDate.getTime();
          break;
      }
    }
    else if(this.state.time){
      let dateSet = new Date(this.state.dateEpoch);
      
      if(this.state.time.hours == 12){
        if(this.state.time.AMPM === "AM"){
          dateSet.setHours(0);  
        }
        else{
          dateSet.setHours(12);
        }
      }
      else if(this.state.time.AMPM === "PM"){
        dateSet.setHours(+this.state.time.hours + 12);
      }
      else{
        dateSet.setHours(+this.state.time.hours);
      }

      dateSet.setMinutes(+this.state.time.minutes);
      // console.log("minutes: " +this.state.time.minutes);
      // console.log(dateSet.getTime());
      return dateSet.getTime();
      // this.state.dateEpoch
    }
    // console.log("HOW DID I GET HERE");
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

  epochToMoment(epoch){
    let planMoment = moment(epoch);
    // console.log(planMoment.format("MMM Do"));
    return (planMoment.format("ddd, MMM D, h:mm A"));
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

  minCalendarMoment(){
    let date = this._getMinDate()
    let minMoment = moment(date.getTime());
    return minMoment.format("YYYY-MM-DD");
  }

  _pickerItemToString(item){
    let pickerString = "";
    pickerString += item.hours;
    pickerString += ":"
    pickerString += item.minutes;
    pickerString += " "
    pickerString += item.AMPM;
    return pickerString;
  }

   _onPressDate(dateObject){
    let markedDates = new Object();
      markedDates[dateObject.dateString] = {selected:true,marked:false
    };

    // let dateText = "";
    // let twoDigitDay = ("0" + str(dateObject.day)).slice(-2);
    // let twoDigitMonth = ("0" + str(dateObject.month)).slice(-2);
    // let year = (str(dateObject.year));
    let dateSelected = new Date(dateObject.year, dateObject.month-1, dateObject.day);
    firebase.analytics().logEvent("date_changed");
    //console.log(dateSelected.toLocaleDateString());
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    let dateText = dateSelected.toLocaleDateString();
    if(dateSelected.toLocaleDateString() === today.toLocaleDateString()){
      dateText = 'Today'
    }
    else if(dateSelected.toLocaleDateString() === tomorrow.toLocaleDateString()){
      dateText = 'Tomorrow'
    }
    this.setState({text:dateText, markedDates:markedDates, dateEpoch:dateSelected.getTime()});
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
    width:width/2,
    backgroundColor:'#fff',
    // flex:1,
    alignItems:'center',
    justifyContent:'center',
  },

  cancelText:{
    fontSize:30,
    textAlign:'center',
    color:'#a8a8a8',
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
    marginLeft:20,
    color:'#f9264f',
    textAlign:'left',
    fontSize:height*0.035,
    fontWeight:'bold',
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
    height:height*0.43,
    // flex:4,
    marginTop : 10,
    backgroundColor:'#fff',
    marginRight:height*0.018,
    marginLeft:height*0.018,
  },

  calendar:{
    borderRadius:7.5,
    height:height*0.43,
    backgroundColor:'#fff',
    marginRight:height*0.018,
    marginLeft:height*0.018,
    borderWidth:0,
    borderColor:'#fff',
  },



  submitText:{

      marginLeft:10,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:20
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