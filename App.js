//TODO: Change database settings
import React from 'react';
import {
  TabView,
  TabBarBottom,
  DrawerNavigator,
  StackNavigator,
  TabNavigator
} from 'react-navigation';

import HandleLogin from './src/screens/HandleLogin'
import UploadProfilePicture from './src/screens/UploadProfilePicture'
import EnterName from './src/screens/EnterName'

import firebase from 'react-native-firebase';

//UPDATETODO When Updating Libraries Update Libraries:
/*
  Make giftedchat cache.

*/

// Final TODO:
//   Check over passing nav parameters
//   Ellipsize All Text
//   https://www.linkedin.com/pulse/image-caching-react-native-william-candillon
//   For static images: https://github.com/wcandillon/react-native-static-images

// Refactoring:
//   Style
//   Networking
//   Image Caching

// // Initialize Firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyAbVjJWe9wAAdR8cmXFGxyXy2RH1dfQLrM",
//     authDomain: "planit-firebase-c354a.firebaseapp.com",
//     databaseURL: "https://planit-firebase-c354a.firebaseio.com",
//     projectId: "planit-firebase-c354a",
//     storageBucket: "planit-firebase-c354a.appspot.com",
//     messagingSenderId: "638460999015"

// };

// firebase.initializeApp(firebaseConfig);
console.disableYellowBox = true;




// And lastly stack together drawer with tabs and modal navigation
// because we want to be able to call Modal screen from any other screen
export default StackNavigator({
  HandleLogin:{
    screen:HandleLogin,
  },

 },
 {
  // In modal mode screen slides up from the bottom
  mode: 'modal',
  // No headers for modals. Otherwise we'd have two headers on the screen, one for stack, one for modal.
  headerMode: 'none',
});