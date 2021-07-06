import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import CardView from 'react-native-cardview'
import Clipboard from '@react-native-community/clipboard';
import executeQuery from "../../sqlite/sqlite_executeQuery";
import { format } from 'date-fns'
import { CommonEncryptPassword, CommonDecryptPassword } from '../../assets/utils/PasswordFunction'
import Toast from 'react-native-simple-toast'
import { icons } from '../../constants';

export default class PasswordListItem extends Component {

  constructor(props) {
    super(props)
    // console.log("PasswordList.js -> constructor")
    // console.log(this.props.password_folder)

    this.state = {
      password_folder: this.props.password_folder,
      password_key: this.props.password_key,
      password_password: "",
      passwordCurrent: 'Loading',
      isOptionsOpen: false,
      passwordsList: []
    }
  }

  componentDidMount() {
    // console.log("")
    // console.log(this.props)
    // console.log("")
    this.getPasswordList()
  }

  insertPassword = async () => {

    let password_folder = this.state.password_folder
    password_folder = password_folder.trim().toLowerCase()
    let password_key = this.state.password_key
    password_key = password_key.trim().toLowerCase()
    let password_password = this.state.password_password
    password_password = password_password.trim()

    if (password_folder === "" || password_key === "" || password_password === "") {
      Alert.alert("Error:", "Password is Empty.")
      return;
    }

    password_password = await CommonEncryptPassword(password_password)

    let sql = "INSERT INTO password_list (passwordList_folder, passwordList_key, passwordList_password, passwordList_datetime) VALUES ( ? , ? , ? , ? )";
    var currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

    try {
      let results = await executeQuery(sql, [password_folder, password_key, password_password, currentDateTime])
      // console.log(results)
      Alert.alert("Success:", "Added Successfully")
      // console.log(password_folder, password_key, password_password, currentDateTime)
      this.setState({
        password_password: ""
      }, () => {
        Keyboard.dismiss()
        this.getPasswordList()
      })
    } catch (err) {
      // console.log("Promise -> Error: ");
      // console.log(err)
    }
  }

  async getPasswordList() {
    let sql = "SELECT * FROM password_list WHERE passwordList_folder = ? AND passwordList_key = ? ORDER BY passwordList_datetime DESC LIMIT 0,10"

    let results = null;
    try {
      let tempArray = []

      results = await executeQuery(sql, [this.state.password_folder, this.state.password_key])
      // console.log("Promise -> Success: ");
      // console.log(results);
      if (results.rows.length !== 0) {
        let rows = results.rows;
        for (let index = 0; index < results.rows.length; index++) {

          let tempRow = rows.item(index)

          // console.log()
          // console.log()

          // console.log("Before:")
          // console.log(tempRow)

          // console.log("Temp: " + tempRow.passwordList_password)

          let dv = await CommonDecryptPassword(tempRow.passwordList_password)

          // console.log("dv: " + dv)

          tempRow.passwordList_password = dv

          // console.log("After:")
          // console.log(tempRow)

          // console.log()
          // console.log()

          tempArray.push(tempRow)
        }
      }
      this.setState({
        passwordsList: tempArray
      }, () => {
        if (tempArray.length >= 1) {
          this.setState({
            passwordCurrent: tempArray[0].passwordList_password
          })
        } else {
          this.setState({
            passwordCurrent: "No Value Added"
          })
        }
      })
      // console.log(tempArray)
    } catch (err) {
      // console.log("Promise -> Error: ");
      // console.log(err);
    }
  }

  render() {
    return (
      <CardView style={{ backgroundColor: '#ffffff', padding: 10 }} >

        <View style={{ backgroundColor: '#ffffff', flex: 1, flexDirection: 'row-reverse' }} >

          <TouchableWithoutFeedback
            style={{
              width: 25,
              height: 25,
            }}
            onPress={async () => {
              this.setState({ isOptionsOpen: !this.state.isOptionsOpen })
            }}
          >
            <Image
              source={(this.state.isOptionsOpen) ? icons.icon_keyboard_arrow_up : icons.icon_keyboard_arrow_down}
              style={{
                width: 25,
                height: 25,
                padding: 10,
                marginHorizontal: 5,
              }}
            />
          </TouchableWithoutFeedback>

          {
            (this.state.passwordsList.length !== 0) && (
              <TouchableWithoutFeedback
                style={{
                  width: 25,
                  height: 25,
                }}
                onPress={async () => {
                  Clipboard.setString(this.state.passwordCurrent)
                  Toast.show('Value Copied Successfully.')
                }}
              >
                <Image
                  source={icons.icon_content_copy}
                  style={{
                    width: 25,
                    height: 25,
                    padding: 10,
                    marginHorizontal: 5,
                  }}
                />
              </TouchableWithoutFeedback>
            )
          }

          <Text style={{ flex: 1, fontWeight: 'bold' }} >{this.state.passwordCurrent}</Text>
        </View>

        {
          (this.state.isOptionsOpen) && (
            <View>

              <CardView
                style={{
                  margin: 10,
                  padding: 10,
                  backgroundColor: '#ffffff',
                  flex: 1,
                  flexDirection: 'row-reverse',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >

                <TouchableWithoutFeedback
                  style={{
                    width: 25,
                    height: 25,
                  }}
                  onPress={async () => {
                    this.insertPassword();
                  }}
                >
                  <Image
                    source={icons.icon_edit}
                    style={{
                      width: 25,
                      height: 25,
                      padding: 10,
                      marginHorizontal: 5,
                    }}
                  />
                </TouchableWithoutFeedback>

                <TextInput
                  style={{ flex: 1, fontWeight: 'bold', padding: 0, paddingHorizontal: 5 }}
                  placeholder="Enter value to update"
                  value={this.state.password_password}
                  onChangeText={((t) => {
                    this.setState({
                      password_password: t
                    })
                  })}
                />
              </CardView>

              {
                this.state.passwordsList.map((passwordsList_item, passwordsList_index) => {
                  return (
                    <CardView
                      key={passwordsList_item.passwordList_datetime}
                      style={{ margin: 10, padding: 10, backgroundColor: '#ffffff', flex: 1, flexDirection: 'row-reverse' }}
                    >

                      <TouchableWithoutFeedback
                        style={{
                          width: 25,
                          height: 25,
                        }}
                        onPress={async () => {
                          Clipboard.setString(passwordsList_item.passwordList_password)
                          Toast.show('Value Copied Successfully.')
                        }}
                      >
                        <Image
                          source={icons.icon_content_copy}
                          style={{
                            width: 25,
                            height: 25,
                            padding: 10,
                            marginHorizontal: 5,
                          }}
                        />
                      </TouchableWithoutFeedback>



                      <View style={{ flex: 1, }} >
                        <Text>{passwordsList_index + 1}. {passwordsList_item.passwordList_password}</Text>
                        <Text style={{ color: 'grey' }} >{passwordsList_item.passwordList_datetime}</Text>
                      </View>
                    </CardView>
                  );
                })
              }

            </View>
          )
        }

      </CardView>
    )
  }

}

const styles = StyleSheet.create({

  title: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 60,
    marginBottom: 40,
    marginHorizontal: 5,
  },

  folderListItem_shadow: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 0,
  },
  folderListItem: {
    padding: 10,
  },

});