import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
  Image,
} from 'react-native';
import { icons } from "../../constants"
import { GlobalStyle } from '../../assets/style/GlobalStyle'
var RNFS = require('react-native-fs');
import executeQuery from "../../sqlite/sqlite_executeQuery";
import { ExportImport_DecryptPassword, CommonEncryptPassword } from '../../assets/utils/PasswordFunction'
import Toast from 'react-native-simple-toast'
import DocumentPicker from 'react-native-document-picker';
import { Constants_Common } from "../../assets/utils/Constants";
import { PERMISSIONS, RESULTS, requestMultiple } from 'react-native-permissions';
import { CommonActions } from "@react-navigation/native";


export default class FileImport extends Component {

  constructor(props) {
    super(props)
    console.log("FileImport.js -> constructor")
    this.state = {
      importStatus: "",
      importFileUri: "",
      importFileName: "",
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

  async importJsonFile() {

    this.setState({
      importStatus: ""
    })

    let importFileUri= "";
    let importFileName= "";
    let fileString = "";
    let result = {}

    console.log("a")

    // Request Permission
    try {
      let statuses = await requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE])
      // console.log('READ_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
      // console.log('WRITE_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);

      if (statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED && statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED) {
        
      } else {
        return;
      }

    } catch (error) {
      console.log(error)
      return;
    }

    // Select File
    try {
      const temp_fileInfo = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        temp_fileInfo.uri,
        temp_fileInfo.type, // mime type
        temp_fileInfo.name,
        temp_fileInfo.size
      )
      console.log(temp_fileInfo)
      
      console.log("abcde")

      importFileUri  = temp_fileInfo.uri;
      importFileName = temp_fileInfo.name;
    } catch (err) {
      console.log(err)
      // if (DocumentPicker.isCancel(err)) {
      //   // User cancelled the picker, exit any dialogs or menus and move on
      // } else {
      //   throw err;
      // }
      return;
    }

    console.log("abcde")

    // Read File
    try {
      fileString = await RNFS.readFile(importFileUri, "utf8");
      console.log(fileString)
    } catch (e) {
      console.log(e)
      Toast.show("File Read Error.")
      return;
    }

    // Verify File
    try {
      result = JSON.parse(fileString)
      console.log("result:")
      console.log(result)
    } catch (error) {
      console.log(error)
      Toast.show("Invalid File. Please select a valid file.")
      return
    }

    // Verify File
    if (result.data_info.applicationName !== Constants_Common.FolderName) {
      Toast.show("Invalid File. Please select a valid file.")
      return;
    }

    if(result.data.password_folder){
      await this.insertAllFoler(result.data.password_folder)
    }
    if(result.data.password_key){
      await this.insertAllKey(result.data.password_key)
    }
    if(result.data.password_list){
      await this.insertAllPassword(result.data.password_list)
    }
    return

  }

  insertAllFoler = async (data) => {
    let password_folder = data
    let password_folder_insert = 0
    let password_folder_error = 0
    let data_failed = []
    for (let index = 0; index < password_folder.length; index++) {
      const element = password_folder[index];
      if (element.password_folder) {
        if (element.password_folder.trim() !== "") {
          let temp = await this.replacePasswordFolder(element.password_folder)
          if (temp) {
            password_folder_insert += 1
          } else {
            password_folder_error += 1
            data_failed.push(element)
          }
        } else {
          password_folder_error += 1
          data_failed.push(element)
        }
      }
    }

    console.log("password_folder_insert: " + password_folder_insert)
    console.log("password_folder_insert: " + password_folder_error)

    let password_folder_status = ""
    password_folder_status += "\nFolder:"
    password_folder_status += "\n\tInsert: " + password_folder_insert
    password_folder_status += "\n\tInsert Failed: " + password_folder_error

    if (password_folder_error >= 1) {
      password_folder_status += "\n\tFailed List: "
      for (let index = 0; index < data_failed.length; index++) {
        const element = data_failed[index];
        password_folder_status += "\n\t" + (index + 1) + ". Folder Name:" + element.password_folder
      }
    }

    this.setState({
      importStatus: this.state.importStatus + password_folder_status
    })
  }

  insertAllKey = async (data) => {

    // let data = data 
    let data_insert = 0
    let data_error = 0
    let data_failed = []

    // let password_folder = data 
    // let password_folder_insert = 0
    // let password_folder_error = 0
    // let data_failed = []

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.passwordKey_folder && element.passwordKey_key) {
        if (element.passwordKey_folder.trim() !== "" && element.passwordKey_key.trim() !== "") { // 
          let temp = await this.replacePasswordKey(element.passwordKey_folder, element.passwordKey_key)
          if (temp) {
            data_insert += 1
          } else {
            data_error += 1
            data_failed.push(element)
          }
        } else {
          data_error += 1
          data_failed.push(element)
        }
      }
    }

    console.log("data_insert: " + data_insert)
    console.log("data_error: " + data_error)

    let data_status = "\n\n"
    data_status += "\Key:"
    data_status += "\n\tInsert: " + data_insert
    data_status += "\n\tInsert Failed: " + data_error

    if (data_error >= 1) {
      data_status += "\n\tFailed List: "
      for (let index = 0; index < data_failed.length; index++) {
        const element = data_failed[index];
        // data_status += "\n\t" + (index+1) + ". Folder Name:" + element.password_folder
      }
    }

    this.setState({
      importStatus: this.state.importStatus + data_status
    })
  }

  insertAllPassword = async (data) => {

    let data_insert = 0
    let data_error = 0
    let data_failed = []

    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      console.log("Encrypt: ", element.passwordList_password)
      element.passwordList_password = await ExportImport_DecryptPassword(element.passwordList_password)

      if (element.passwordList_folder && element.passwordList_key && element.passwordList_password && element.passwordList_datetime) {
        if (
          element.passwordList_folder.trim() !== "" &&
          element.passwordList_key.trim() !== "" &&
          element.passwordList_password.trim() !== "" &&
          element.passwordList_datetime.trim() !== ""
        ) {
          let temp = await this.replacePasswordPassword(
            element.passwordList_folder,
            element.passwordList_key,
            element.passwordList_password,
            element.passwordList_datetime
          )
          if (temp) {
            data_insert += 1
          } else {
            data_error += 1
            data_failed.push(element)
          }
        } else {
          data_error += 1
          data_failed.push(element)
        }
      }
    }

    console.log("data_insert: " + data_insert)
    console.log("data_error: " + data_error)

    let data_status = "\n"
    data_status += "\nPassword:"
    data_status += "\n\tInsert: " + data_insert
    data_status += "\n\tInsert Failed: " + data_error

    if (data_error >= 1) {
      data_status += "\n\tFailed List: "
      for (let index = 0; index < data_failed.length; index++) {
        const element = data_failed[index];
        // data_status += "\n\t" + (index+1) + ". Folder Name:" + element.password_folder
      }
    }

    this.setState({
      importStatus: this.state.importStatus + data_status
    })
  }

  replacePasswordFolder = async (folderName) => {

    let inputFolderName = folderName
    inputFolderName = inputFolderName.trim().toLowerCase()

    let sql = "REPLACE INTO password_folder(password_folder ) VALUES( ? )"

    let result = null;
    try {
      let results = await executeQuery(sql, [inputFolderName])
      return true
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err)
      return false
    }
  }

  replacePasswordKey = async (folderName, keyName) => {

    let inputFolderName = folderName
    inputFolderName = inputFolderName.trim().toLowerCase()

    let inputKeyName = keyName
    inputKeyName = inputKeyName.trim().toLowerCase()

    let sql = "REPLACE INTO password_key(passwordKey_folder, passwordKey_key ) VALUES( ? , ? )"

    let result = null;
    try {
      let results = await executeQuery(sql, [inputFolderName, inputKeyName])
      return true
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err)
      return false
    }
  }

  replacePasswordPassword = async (folderName, keyName, keyValue, keyDateTime) => {

    let inputFolderName = folderName
    inputFolderName = inputFolderName.trim().toLowerCase()

    let inputKeyName = keyName
    inputKeyName = inputKeyName.trim().toLowerCase()

    let inputKeyValue = keyValue
    inputKeyValue = await CommonEncryptPassword(inputKeyValue)

    let inputDateTime = keyDateTime
    inputDateTime = inputDateTime.trim().toLowerCase()

    let insertStatus = await this.doesPasswordExist( folderName, keyName, keyValue, keyDateTime )
    console.log(insertStatus)
    if( insertStatus === "exist" ){
      return true
    }

    let sql = "REPLACE INTO password_list(passwordList_folder , passwordList_key, passwordList_password, passwordList_datetime ) VALUES( ? , ? , ? , ? )"

    let result = null;
    try {
      let results = await executeQuery(sql, [inputFolderName, inputKeyName, inputKeyValue, inputDateTime])
      return true
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err)
      return false
    }
  }

  doesPasswordExist = async (folderName, keyName, keyValue, keyDateTime) => {

    let insertStatus = ""

    let inputFolderName = folderName
    inputFolderName = inputFolderName.trim().toLowerCase()

    let inputKeyName = keyName
    inputKeyName = inputKeyName.trim().toLowerCase()

    let inputKeyValue = keyValue
    // inputKeyValue = await CommonEncryptPassword(inputKeyValue)

    let inputDateTime = keyDateTime
    inputDateTime = inputDateTime.trim().toLowerCase()

    let sql = "SELECT passwordList_password FROM password_list WHERE passwordList_folder = ? AND passwordList_key = ? AND passwordList_datetime = ?";

    try {
      let results = await executeQuery(sql, [inputFolderName, inputKeyName, inputDateTime])
      
      if( results.rows.length == 0 ){
        insertStatus = "not_exist"
      } else {
        insertStatus = "exist"
      }

      return insertStatus
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err)
      return "not_exist"
    }

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
          <View>

            <View style={{ marginTop: 60, marginBottom: 30 }} >
              <Text style={{ textAlign: 'center', fontSize: 30 }} >Import</Text>
            </View>

            <TouchableOpacity>
              <Text
                style={{ margin: 10, padding: 10, backgroundColor: '#ffffff', textAlign: 'center' }}
                onPress={() => {
                  this.importJsonFile();
                }}
              >Import File</Text>
            </TouchableOpacity>

            {
              (this.state.importStatus !== "") && (
                <Text style={{ padding: 10 }} >{this.state.importStatus}</Text>
              )
            }

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