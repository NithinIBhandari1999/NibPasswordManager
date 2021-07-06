import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
} from 'react-native';
import { CommonActions } from "@react-navigation/native";
import { Constants_AsyncStorageKeys, Constants_Common } from "../../assets/utils/Constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NibPasswordManagerIcon from '../../assets/image/NibPasswordManagerIcon.png'
import CardView from 'react-native-cardview';

export default class SplashScreen extends Component {

  constructor(props) {
    super(props)
    console.log("SplashScreen.js -> constructor")
    console.log(props)
    global.passwordMaster = ""
  }
  
  async componentDidMount() {

    let goToScreen = "FolderList"

    try {
        let MasterPasswordSetStatus = await AsyncStorage.getItem(Constants_AsyncStorageKeys.MasterPasswordSetStatus)
        console.log("MasterPasswordSetStatus: " + MasterPasswordSetStatus)
        if (MasterPasswordSetStatus === "true") {
          goToScreen = "MasterPasswordVerify"
        } else {
          goToScreen = "MasterPasswordSet"
        }
    } catch (error) {
      console.log(error)
    }

    console.log("Go to Other Screen")
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: goToScreen }],
      })
    )

  }

  render() {
    return (
      <View style={{
        display: 'flex',
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50
      }}>
        <Text style={{fontSize: 10 , opacity: 0.50 }} >NIB</Text>
        <Text style={{fontSize: 20 , marginVertical: 10}} >Password Manager</Text>
        <Text style={{fontSize: 15}} >(Offline)</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({

});