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
  ActivityIndicator
} from 'react-native';
import { Button, Icon, List, ListItem, SearchBar } from 'react-native-elements';

export default class User {
  
  constructor(fullname,username,email,phonenumber, userid, photoURL, currentFriends, friendRequests=[],invited=[],joined=[],hosted=[]){
    this.fullname = fullname;
    this.username = username;
    this.email = email;
    this.userid = userid;
    this.photoURL = photoURL;
    this.currentFriends = currentFriends;
    this.phonenumber = phonenumber;
    this.friendRequests = friendRequests;
    this.invited = invited;
    this.joined = joined;
    this.hosted = hosted      ;
  }

}