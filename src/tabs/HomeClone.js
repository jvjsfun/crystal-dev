import React, { Component } from 'react';
import {
  // Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';
import { Button } from 'react-native-elements'
export default class Home extends Component {

  constructor() {
      super();

      this.state = {
          textInputValue: ''
      }
  }

  render() {
    const { navigate } = this.props.navigation;
  
    return (
      <View style={styles.container}>                
        <TouchableHighlight
          style={styles.submit}
          // onPress={() => this.submitSuggestion(this.props)}
          underlayColor='#fff'>
          <Text style={styles.submitText}>I want to...</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.submit}
          // onPress={() => this.submitSuggestion(this.props)}
          underlayColor='#fff'>
          <Text style={styles.submitText}>
            With
            <Text style = {{fontWeight:'bold', color:'#ff4255', marginLeft:'100'}}>
              {' '}All Friends
            </Text>
          </Text>
        </TouchableHighlight>

        <View style = {styles.timeplace}>
          <Button
            large
            icon={{name: 'clock', type: 'evilicon'}}
            title='Today'
            backgroundColor = '#ff4255'
            textStyle = {styles.timeplaceText}
            buttonStyle = {{width:width*.8}}
             />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4255',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginVertical: 20,
  },
  submit:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'#fff',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  submitText:{

      marginLeft:10,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:20
  },
  timeplace:{
    width:width*.9,
    backgroundColor:'#ff4255',
  },

  timeplaceText:{

      marginLeft:2,
      color:'#fff',
      textAlign:'left',
      fontSize:20
  },
});