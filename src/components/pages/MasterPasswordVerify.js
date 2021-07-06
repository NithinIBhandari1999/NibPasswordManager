import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import {icons} from '../../constants';
import CardView from 'react-native-cardview';
import {
  CommonMasterPasswordVerify,
} from '../../assets/utils/PasswordFunction';
import {
  Constants_AsyncStorageKeys,
} from '../../assets/utils/Constants';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class MasterPasswordSet extends Component {
  constructor(props) {
    super(props);
    console.log('MasterPasswordSet.js -> constructor');
    this.state = {
      masterPasswordInput: '',

      contain_0_to_9: false,
      contain_A_to_Z: false,
      contain_a_to_z: false,
      contain_specialSymbol: false,
      contain_passwordMinimumLength: false,
    };
  }

  onSubmit = async () => {
    try {
      let result = await CommonMasterPasswordVerify(
        this.state.masterPasswordInput,
      );
      if (result === 'S') {
        let goToScreen = 'MasterPasswordSet';

        try {
          let MasterPasswordSetStatus = await AsyncStorage.getItem(
            Constants_AsyncStorageKeys.MasterPasswordSetStatus,
          );
          console.log('MasterPasswordSetStatus: ' + MasterPasswordSetStatus);
          if (MasterPasswordSetStatus === 'true') {
            goToScreen = 'SettingUp';
            global.passwordMaster = this.state.masterPasswordInput;
          } else {
            goToScreen = 'MasterPasswordSet';
          }
        } catch (error) {
          console.log(error);
        }

        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: goToScreen}],
          }),
        );
      } else {
        Alert.alert('Error:', 'Password is wrong.');
      }
    } catch (error) {}
  };

  onChangeTextPassword = (t) => {
    var inputText = t;
    var masterPasswordSubmit = false;

    let contain_0_to_9 = false;
    let contain_A_to_Z = false;
    let contain_a_to_z = false;
    let contain_specialSymbol = false;
    let contain_passwordMinimumLength = false;

    if (inputText.length >= 10) {
      contain_passwordMinimumLength = true;
    }

    for (let index = 0; index < inputText.length; index++) {
      const element = inputText.charCodeAt(index);
      if (element >= 48 && element <= 57) {
        // console.log("contain_0_to_9 (" + inputText[index] + ") (" + element + "):" + true)
        contain_0_to_9 = true;
      } else if (element >= 65 && element <= 90) {
        // console.log("contain_A_to_Z (" + inputText[index] + ") (" + element + "):" + true)
        contain_A_to_Z = true;
      } else if (element >= 97 && element <= 122) {
        // console.log("contain_a_to_z (" + inputText[index] + ") (" + element + "):" + true)
        contain_a_to_z = true;
      } else {
        // console.log("contain_specialSymbol (" + inputText[index] + ") (" + element + "):" + true)
        contain_specialSymbol = true;
      }
    }

    if (
      contain_0_to_9 &&
      contain_A_to_Z &&
      contain_a_to_z &&
      contain_specialSymbol &&
      contain_passwordMinimumLength
    ) {
      masterPasswordSubmit = true;
    }

    // console.log()
    // console.log("contain_0_to_9: " + contain_0_to_9)
    // console.log("contain_A_to_Z: " + contain_A_to_Z)
    // console.log("contain_a_to_z: " + contain_a_to_z)
    // console.log("contain_specialSymbol: " + contain_specialSymbol)
    // console.log("contain_passwordMinimumLength: " + contain_passwordMinimumLength)

    this.setState({
      contain_0_to_9,
      contain_A_to_Z,
      contain_a_to_z,
      contain_specialSymbol,
      contain_passwordMinimumLength,
      masterPasswordInput: inputText,
      masterPasswordSubmit,
    });
  };

  render() {
    let navigation = this.props.navigation;
    return (
      <ScrollView>
        <View
          style={{
            padding: 20,
          }}>
          <Text
            style={{
              marginVertical: 5,
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Login
          </Text>

          <CardView style={{marginVertical: 5}}>
            <TextInput
              style={{padding: 11}}
              value={this.state.masterPasswordInput}
              onChangeText={(t) => {
                this.onChangeTextPassword(t);
              }}
              placeholder="Enter Master Password"
            />
          </CardView>

          {/* Validation */}
          <View>
            <CardView style={styles.passwordVerifyResult_cardView}>
              <Image
                source={
                  this.state.contain_A_to_Z
                    ? icons.icon_check
                    : icons.icon_close
                }
                style={{
                  width: 25,
                  height: 25,
                  margin: 5,
                }}
              />
              <View style={styles.passwordVerifyResult_text}>
                <Text>Capital Letter (atleast one)</Text>
              </View>
            </CardView>

            <CardView style={styles.passwordVerifyResult_cardView}>
              <Image
                source={
                  this.state.contain_a_to_z
                    ? icons.icon_check
                    : icons.icon_close
                }
                style={{
                  width: 25,
                  height: 25,
                  margin: 5,
                }}
              />
              <View style={styles.passwordVerifyResult_text}>
                <Text>Small Letter (atleast one)</Text>
              </View>
            </CardView>

            <CardView style={styles.passwordVerifyResult_cardView}>
              <Image
                source={
                  this.state.contain_0_to_9
                    ? icons.icon_check
                    : icons.icon_close
                }
                style={{
                  width: 25,
                  height: 25,
                  margin: 5,
                }}
              />
              <View style={styles.passwordVerifyResult_text}>
                <Text>Number (atleast one)</Text>
              </View>
            </CardView>

            <CardView style={styles.passwordVerifyResult_cardView}>
              <Image
                source={
                  this.state.contain_specialSymbol
                    ? icons.icon_check
                    : icons.icon_close
                }
                style={{
                  width: 25,
                  height: 25,
                  margin: 5,
                }}
              />
              <View style={styles.passwordVerifyResult_text}>
                <Text>Special Symbol (atleast one)</Text>
              </View>
            </CardView>

            <CardView style={styles.passwordVerifyResult_cardView}>
              <Image
                source={
                  this.state.contain_passwordMinimumLength
                    ? icons.icon_check
                    : icons.icon_close
                }
                style={{
                  width: 25,
                  height: 25,
                  margin: 5,
                }}
              />
              <View style={styles.passwordVerifyResult_text}>
                <Text>Minimum Length should be 10</Text>
              </View>
            </CardView>
          </View>

          <CardView style={{marginBottom: 100}}>
            <TouchableOpacity
              style={{backgroundColor: 'black'}}
              onPress={() => this.onSubmit()}>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'center',
                  margin: 10,
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </CardView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  passwordVerifyResult_cardView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    margin: 1,
    borderRadius: 0,
  },
  passwordVerifyResult_icon: {
    fontSize: 30,
    padding: 10,
  },
  passwordVerifyResult_text: {
    flex: 1,
  },
});
