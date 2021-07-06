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
import { GlobalStyle } from '../../assets/style/GlobalStyle';
import CardView from 'react-native-cardview'
import { PERMISSIONS, RESULTS, requestMultiple } from 'react-native-permissions';
var RNFS = require('react-native-fs');
import executeQuery from "../../sqlite/sqlite_executeQuery";
import { ExportImport_EncryptPassword, CommonDecryptPassword } from '../../assets/utils/PasswordFunction'
import { format } from 'date-fns'
import Toast from 'react-native-simple-toast'
import { Constants_Common } from "../../assets/utils/Constants";
import { CommonActions } from "@react-navigation/native";
import { icons } from "../../constants"

export default class FileExport extends Component {

  constructor(props) {
    super(props)
    console.log("FileExport.js -> constructor")
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

  exportTextFile = async () => {

    let exportFile = false;

    try {
      let statuses = await requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE])
      // console.log('READ_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
      // console.log('WRITE_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);

      if (statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED && statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED) {
        exportFile = true;
        // console.log(exportFile)
      }

    } catch (error) {
      // console.log(error)
    }

    if (exportFile == false) {
      return;
    }

    try {
      let result = await RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/NibPasswordManager')
      // console.log("Result:")
      // console.log(result)
    } catch (error) {
      // console.log("Error:")
      // console.log(error)
    }

    var currentDateTime = format(new Date(), 'yyyy_MM_dd_HH_mm_ss')
    var path = RNFS.ExternalStorageDirectoryPath + '/' + Constants_Common.FolderName + '/' + Constants_Common.FolderName + '_backup_norestore_' + currentDateTime + '.txt';

    // console.log("Out WriteText S")
    let WriteText = await this.getAllPasswords_Text()
    // console.log("Out WriteText E")

    // write the file
    RNFS.writeFile(path, WriteText, 'utf8')
      .then((success) => {
        // console.log('FILE WRITTEN!');
        // console.log(success)
        Toast.show('File Stored Successfully at ' + "'" + path + "'" , Toast.LONG )
      })
      .catch((err) => {
        // console.log(err.message);
      });

  }

  exportJsonFile = async () => {

    let exportFile = false;

    try {
      let statuses = await requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE])
      // console.log('READ_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
      // console.log('WRITE_EXTERNAL_STORAGE', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);

      if (statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED && statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED) {
        exportFile = true;
        // console.log(exportFile)
      }

    } catch (error) {
      // console.log(error)
    }

    if (exportFile == false) {
      return;
    }

    try {
      let result = await RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + '/NibPasswordManager')
      // console.log("Result:")
      // console.log(result)
    } catch (error) {
      // console.log("Error:")
      // console.log(error)
    }

    var currentDateTime = format(new Date(), 'yyyy_MM_dd_HH_mm_ss')
    var path = RNFS.ExternalStorageDirectoryPath + '/' + Constants_Common.FolderName + '/' + Constants_Common.FolderName + '_backup_restore_' + currentDateTime + '.json';

    // console.log("Out WriteText S")
    let WriteText = await this.getAllPasswords_Json()
    // console.log("Out WriteText E")

    // write the file
    RNFS.writeFile(path, WriteText, 'utf8')
      .then((success) => {
        // console.log('FILE WRITTEN!');
        // console.log(success)
        Toast.show('File Stored Successfully at ' + "'" + path + "'" , Toast.LONG )
      })
      .catch((err) => {
        // console.log(err.message);
      });

  }

  async getAllPasswords_Text() {
    let returnText = "";
    let returnText_Latest = "";
    let returnText_All = "";
    console.log("In WriteText S")

    returnText +=   "----------------------------"
    returnText += "\n--- Nib Password Manager ---"
    returnText += "\n----------------------------"
    returnText += "\n"

    returnText_Latest += "\n---------------------------------------"
    returnText_Latest += "\n----------- Latest Password -----------"
    returnText_Latest += "\n---------------------------------------"
    returnText_Latest += "\n"

    returnText_All += "\n------------------------------------"
    returnText_All += "\n----------- All Password -----------"
    returnText_All += "\n------------------------------------"
    returnText_All += "\n"

    let result_folderList = await this.getFolderList();
    for (let index = 0; index < result_folderList.length; index++) {
      const result_folderList_item = result_folderList[index];

      returnText_Latest += "\n"
      returnText_Latest += "\n--------------------"
      returnText_Latest += "\nFolder Name: "  + result_folderList_item.password_folder
      returnText_Latest += "\n"

      returnText_Latest += "\nKeys:"

      returnText_All += "\n"
      returnText_All += "\n--------------------"
      returnText_All += "\nFolder Name: " + result_folderList_item.password_folder
      returnText_All += "\n"

      returnText_All += "\nKeys:"

      let result_keyList = await this.getKeyList(result_folderList_item.password_folder)
      for (let index = 0; index < result_keyList.length; index++) {
        const result_keyList_item = result_keyList[index];

        returnText_All += "\n- " + result_keyList_item.passwordKey_key

        let result_valueList = await this.getPasswordList( result_folderList_item.password_folder , result_keyList_item.passwordKey_key )     

        if( result_valueList.length == 0 ){
          returnText_Latest += "\n\t--No Value--"
          returnText_All += "\n\t--No Value--"
        } else {

          for (let index = 0; index < result_valueList.length; index++) {
            let result_valueList_item = result_valueList[index]
            returnText_All += "\n\t" + result_valueList_item.passwordList_password
            returnText_All += "\n\t(" + result_valueList_item.passwordList_datetime + ")"
          }
          
          let result_valueList_item = result_valueList[0]
          returnText_Latest += "\n" + result_keyList_item.passwordKey_key + ": " + result_valueList_item.passwordList_password
            
        }

      }

    }

    console.log("In WriteText E")

    returnText += returnText_Latest + returnText_All
    console.log(returnText)

    return returnText;
  }

  async getAllPasswords_Json() {
    let returnText = "";

    let result_folderList = await this.getAllFolderList();
    let result_keyList = await this.getAllKeyList();
    let result_passwordList = await this.getAllPasswordList();

    console.log(result_folderList)
    console.log(result_keyList)
    console.log(result_passwordList)

    var result = {
      "password_folder": result_folderList,
      "password_key": result_keyList,
      "password_list": result_passwordList,
    }

    var result = {
      "data_info":{
        "applicationName": Constants_Common.FolderName,
        "applicationVersion": "1"
      },
      "data": {
        "password_folder": result_folderList,
        "password_key": result_keyList,
        "password_list": result_passwordList,
      }
    }

    return JSON.stringify(result);
  }

  async getFolderList() {
    let returnList = []
    let sql = "SELECT * FROM password_folder ORDER BY password_folder ASC"

    let results = null;
    try {
      let temp_password_folder_list = []

      results = await executeQuery(sql, [])
      // console.log("Promise -> Success: ");
      // console.log(results);
      if (results.rows.length !== 0) {
        let rows = results.rows;
        for (let index = 0; index < results.rows.length; index++) {
          temp_password_folder_list.push(rows.item(index))
        }
      }

      returnList = temp_password_folder_list

    } catch (err) {
      return []
    }
    return returnList
  }

  async getKeyList(password_folder) {
    let returnList = []
    let sql = "SELECT passwordKey_key FROM password_key WHERE passwordKey_folder = ? ORDER BY passwordKey_key ASC"

    let results = null;
    try {
      let tempArray = []

      results = await executeQuery(sql, [password_folder])
      // console.log("Promise -> Success: ");
      // console.log(results);
      if (results.rows.length !== 0) {
        let rows = results.rows;
        for (let index = 0; index < results.rows.length; index++) {
          tempArray.push(rows.item(index))
        }
      }

      returnList= tempArray

      console.log(tempArray)
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err);
    }

    return returnList;
  }

  async getPasswordList( password_folder , password_key ) {
    let returnList = []
    let sql = "SELECT * FROM password_list WHERE passwordList_folder = ? AND passwordList_key = ? ORDER BY passwordList_datetime DESC "

    let results = null;
    try {
      let tempArray = []

      results = await executeQuery(sql, [password_folder, password_key])
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
        returnList= tempArray
      } else {
        returnList= []
      }
      
      console.log(tempArray)
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err);
    }

    return returnList
  }

  async getAllFolderList() {
    let returnList = []
    let sql = "SELECT * FROM password_folder ORDER BY password_folder ASC"

    let results = null;
    try {
      let temp_password_folder_list = []

      results = await executeQuery(sql, [])
      // console.log("Promise -> Success: ");
      // console.log(results);
      if (results.rows.length !== 0) {
        let rows = results.rows;
        for (let index = 0; index < results.rows.length; index++) {
          temp_password_folder_list.push(rows.item(index))
        }
      }

      returnList = temp_password_folder_list

    } catch (err) {
      return []
    }
    return returnList
  }

  async getAllKeyList() {
    let returnList = []
    let sql = "SELECT * FROM password_key ORDER BY passwordKey_key ASC"

    let results = null;
    try {
      let tempArray = []

      results = await executeQuery(sql)
      // console.log("Promise -> Success: ");
      // console.log(results);
      if (results.rows.length !== 0) {
        let rows = results.rows;
        for (let index = 0; index < results.rows.length; index++) {
          tempArray.push(rows.item(index))
        }
      }

      returnList= tempArray

      // console.log(tempArray)
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err);
    }

    return returnList;
  }
  
  async getAllPasswordList() {
    let returnList = []
    let sql = "SELECT * FROM password_list ORDER BY passwordList_datetime DESC"

    let results = null;
    try {
      let tempArray = []

      results = await executeQuery(sql, [])
      // console.log("Promise -> Success: ");
      // console.log(results);
      if (results.rows.length !== 0) {
        let rows = results.rows;
        for (let index = 0; index < results.rows.length; index++) {
          let tempRow = rows.item(index)
          console.log( "Before: ", tempRow)
          tempRow.passwordList_password = await CommonDecryptPassword(tempRow.passwordList_password)
          tempRow.passwordList_password = await ExportImport_EncryptPassword(tempRow.passwordList_password)
          console.log( "After: ", tempRow)
          tempArray.push(tempRow)
        }
        returnList= tempArray
      } else {
        returnList= []
      }
      
      console.log(tempArray)
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err);
    }

    return returnList
  }

  render() {
    let navigation = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>

        <ScrollView>
          <View>

            <View style={{ marginTop: 60 , marginBottom: 30 }} >
              <Text style={{ textAlign: 'center' , fontSize: 30 }} >Export</Text>
            </View>

            <CardView
              style={{ margin: 10 }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.exportTextFile()
                }}
              >
                <Text style={{ padding: 10 }} >Export (Non Restorable)</Text>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'green' }} >
                <Text style={{ color:'#ffffff' , padding: 10 }} >
                  If you select this option,
                  the will be saved to folder in a non Encrypted format
                  and You cannot restore the file.
                </Text>
              </View>
            </CardView>

            <CardView
              style={{ margin: 10 }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.exportJsonFile()
                }}
              >
                <Text style={{ padding: 10 }} >Export (Restorable)</Text>
              </TouchableOpacity>
              <View style={{ backgroundColor: 'green' }} >
                <Text style={{ color:'#ffffff' , padding: 10 }} >
                  If you select this option,
                  the will be saved to folder in a non Encrypted format
                  but You can restore the file.
                </Text>
              </View>
            </CardView>

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