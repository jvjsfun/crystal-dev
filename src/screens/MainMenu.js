import React from 'react';
import {
  TabView,
  TabBarBottom,
  DrawerNavigator,
  StackNavigator,
  TabNavigator
} from 'react-navigation';
import {
  Image,
  Dimensions
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
var {height, width} = Dimensions.get('window');
// Tab navigation for Home and Settings screens
export default TabNavigator({


   Profile: {
    screen: ProfileTab,
    navigationOptions: {
      tabBarLabel : '',
      tabBarIcon: ({ tintColor, focused }) => 
      <Image
          source = {focused ? require('./../icons/MyProfile1.png') : require('./../icons/MyProfile0.png')}
          style = {{height:height*0.05, width: height*0.05}}
      />
    },

  },
   
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel : '',
      tabBarIcon: ({ tintColor, focused }) =>
        <Image
          source = {focused ? require('./../icons/Create1.png') : require('./../icons/Create0.png')}
          style = {{height:height*0.05, width: height*0.05}}
        />
    },

  },

  Events: {
    screen: Events,
    navigationOptions: {
      tabBarLabel : '',
      tabBarIcon: ({ tintColor, focused }) => 
      <Image
          source = {focused ? require('./../icons/Home1.png') : require('./../icons/Home0.png')}
          style = {{ height:height*0.05, width: height*0.05}}
      />
    },

  },

  
  
},

{

  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  initialLayout:{
    height:height*0.078,
    width:width,
  },
  swipeEnabled:false,
  // lazy:true,
  tabBarOptions:{
     showLabel:false,
     activeTintColor:'#f9264f',
     style:{
      height:height*0.078,
      borderTopColor:'rgba(0,0,0,.3)'
     }
  },
  initialRouteName:'Home',
  screenProps:this.props && this.props.screenProps ? this.props.screenProps.name : 'failure',
});
