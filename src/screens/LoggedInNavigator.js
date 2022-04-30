// And lastly stack together drawer with tabs and modal navigation
// because we want to be able to call Modal screen from any other screen
import React from 'react';
import {
  TabView,
  TabBarBottom,
  DrawerNavigator,
  StackNavigator,
  TabNavigator
} from 'react-navigation';

import {
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from '../tabs/Home';
//import Settings from '../tabs/Settings';

import ProfileTab from '../tabs/ProfileTab';

import AddedMe from '../screens/AddedMe';
import AddFriends from '../screens/AddFriends';
import MyFriends from '../screens/MyFriends';
import Settings from '../screens/Settings';
import Events from '../tabs/Events'
import Plan from '../screens/Plan'
import DateTimePicker from '../screens/DateTimePicker'
import MainMenu from '../screens/MainMenu'
import LocationPicker from '../screens/LocationPicker'
import WithFriends from '../screens/WithFriends'
import AddNearby from '../screens/AddNearby'
import ChatPage from '../screens/ChatPage'
import SelectGroups from '../screens/SelectGroups'
import EditPlan from '../screens/EditPlan'
import AddMore from '../screens/AddMore'
import CreateGroup from '../screens/CreateGroup'



export default class LoggedInNavigator extends React.Component{

  render(){

    return <Navigator screenProps = {this.props} />;
  }

}
const transitionConfig = () => ({
    transitionSpec: {
      duration: 0,
      timing: Animated.timing,
      easing: Easing.step0,
    },
  })
const Navigator = StackNavigator({
  MainMenu: {
    screen: MainMenu,
  },

  AddFriends: {
    screen: AddFriends,
  },

  AddedMe: {
    screen: AddedMe,

  },

  MyFriends: {
    screen: MyFriends,
  },

  Settings:{
    screen: Settings
  },

  Plan:{
    screen:Plan
  },

  DateTimePicker:{
    screen: DateTimePicker
  },

  LocationPicker:{
    screen:LocationPicker
  },

  WithFriends:{
    screen:WithFriends
  },

  AddNearby:{
    screen:AddNearby
  },

  ChatPage:{
    screen:ChatPage
  },

  SelectGroups:{
    screen:SelectGroups
  },

  EditPlan:{
    screen:EditPlan
  },

  AddMore:{
    screen:AddMore
  },

  CreateGroup:{
    screen:CreateGroup
  },




}, {
  
  // In modal mode screen slides up from the bottom
  mode: 'card',
  // No headers for modals. Otherwise we'd have two headers on the screen, one for stack, one for modal.
  headerMode: 'none',
  transitionConfig:transitionConfig,
  navigationOptions:{
    gesturesEnabled:true,
  },
  gesturesEnabled:false,
  cardStack: {
    gesturesEnabled: false,
  },
});