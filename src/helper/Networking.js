import React, { Component } from 'react';
import * as firebase from 'firebase';



export function getCurrentUserData(responseFunction){
    let uid =  '26IhkLTnjrhuy2mnOeyWtJfg98w2';//firebase.auth().currentUser.uid;
    //console.log("current uid: " + uid)
    firebase.database().ref('Users/' + uid).once('value').then(function(snapshot) {
      
      var username = snapshot.val();
      responseFunction(username);
      // ...
    });

}

export function getUserData(uid, responseFunction){
    //console.log("Getting uid: " + uid)
    firebase.database().ref('Users/' + uid).once('value').then(function(snapshot) {
      
      var username = snapshot.val();
      responseFunction(username);
      // ...
    });

}