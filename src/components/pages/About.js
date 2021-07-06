import React, { Component } from 'react';
import {
  BackHandler,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Linking,
} from 'react-native';
import { icons } from "../../constants"
import { GlobalStyle } from '../../assets/style/GlobalStyle';
import { CommonActions } from "@react-navigation/native";

export default class About extends Component {

  constructor(props) {
    super(props)
    console.log("About.js -> constructor")
    this.state = {

    }
  }

  componentDidMount() {
    
    // Go Back
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      ()=>{
        this.props.navigation.dispatch(
          CommonActions.reset({
             index: 0,
             routes: [{ name: "FolderList" }],
         })
        )
        return true;
      }
    );

  }

  componentWillUnmount() {

    // Go Back
    this.backHandler.remove();

  }

  renderFooter(){
    return(
      <View style={GlobalStyle.footer} >

          <TouchableWithoutFeedback
            style={{ flex: 1,  }}
            onPress={() => {
              this.props.navigation.openDrawer();
            }}
          >
            <View
              style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Image
                source={icons.icon_menu}
                style={{
                  width: 20,
                  height:20,
                  padding: 10,
                  marginRight: 5,
                }}
                />
              <Text
                style={{
                  color: '#000000'
                }}
              >Menu</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            style={{ flex: 1,  }}
            onPress={() => {
              this.props.navigation.dispatch(
                CommonActions.reset({
                   index: 0,
                   routes: [{ name: "FolderList" }],
               })
              )
            }}
          >
            <View
              style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Image
                source={icons.icon_home}
                style={{
                  width: 20,
                  height:20,
                  padding: 10,
                  marginRight: 5,
                }}
                />
              <Text
                style={{
                  color: '#000000'
                }}
              >Home</Text>
            </View>
          </TouchableWithoutFeedback>


      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <ScrollView>
          <View style={{ padding: 10 }} >
            <Text
              style={{ fontSize: 30 , marginTop: 25 }}
            >About</Text>
            <Text>
              Nib Password Manager is a 100% Offline (We do not take internet access), Secure, Easy to Use Password Manager. { '\n' }
            </Text>

            <View>
              <Text
                style={{ fontSize: 30 , marginTop: 25 }}
              >Features</Text>
              <Text>1. Ad Free</Text>
              <Text>2. 100% Offline (This app doesnt take intenet connection)</Text>
              <Text>3. AES Encryption</Text>
              <Text>4. Easy Sync</Text>
              <Text>5. Login System</Text>
              <Text>6. Easy to Use.</Text>
            </View>

            <View>
              <Text
                style={{ fontSize: 30 , marginTop: 25 }}
              >FAQ</Text>
              <View style={{ marginVertical: 10 }} >
                <Text>How do we earn money ?</Text>
                <Text>As We do not take internet access permission, so we do not earn money, this app is completely Free.</Text>
              </View>
            </View>

            <View>
              <Text
                style={{ fontSize: 30 , marginTop: 25 }}
              >Source Code:</Text>
              <Text
                style={{color: 'blue'}}
                onPress={() => Linking.openURL('https://nibpasswordmanager.netlify.app/')}
              >https://nibpasswordmanager.netlify.app/</Text>
            </View>

          </View>
        </ScrollView>

        {/* S: Footer */}
        { this.renderFooter() }
        {/* E: Footer */}

      </View>
    )
  }

}

const styles = StyleSheet.create({

});