import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import RnBgTask from 'react-native-bg-thread';
import migrate from '../../sqlite/migrations';
import SQLite from 'react-native-sqlite-storage';
import { CommonActions } from "@react-navigation/native";

export default class SettingUp extends Component{

  constructor(props){
    super(props)
    console.log("SettingUp.js -> constructor")
    this.state = {

    }
  }

  componentDidMount(){
    
    SQLite.enablePromise(false);
    SQLite.DEBUG = true;
    global.db = SQLite.openDatabase({
        name: 'PasswordManager.db'
      },
      () => {
        console.log('connected')
      },
      () => {
        console.log('not connected')
      }
    )
  
    RnBgTask.runInBackground(() => {
        console.log("a")
        migrate(1);
        console.log("b")
        
        // Go to Screen "FolderList"
        this.props.navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{ name: "FolderList" }],
          })
      )

    })

  }

  render(){
    return (
        <View style={{ flex:1, alignItems: 'center' , justifyContent: 'center' }} >
            <Text style={{ fontSize: 20 }} >Setting Up...</Text>
            <Text>This may take some seconds</Text>
        </View>
    )
  }

}

const styles = StyleSheet.create({
    
});