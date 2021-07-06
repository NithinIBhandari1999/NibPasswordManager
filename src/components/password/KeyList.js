import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  BackHandler,
  Image,
} from 'react-native';
import { icons } from "../../constants"
import { GlobalStyle } from '../../assets/style/GlobalStyle';
import { CommonActions } from "@react-navigation/native";
import executeQuery from "../../sqlite/sqlite_executeQuery";
import CardView from 'react-native-cardview'
import { ScrollView } from 'react-native-gesture-handler';

export default class KeyList extends Component {

  constructor(props) {
    super(props)
    console.log("KeyList.js -> constructor")
    // console.log(this.props.password_folder)

    this.state = {
      password_folder: this.props.password_folder,
      inputKeyName: '',
      passwordKeyList: [],
      passwordKeyListLoading: true,
    }
  }

  componentDidMount() {
    // console.log(this.props)
    this.setState({
      password_folder: this.props.route.params.password_folder
    }, () => {
      this.getKeyList()
    })

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

  doesKeyExist = async () => {
    let inputFolderName = this.state.password_folder
    inputFolderName = inputFolderName.trim().toLowerCase()
    let inputKeyName = this.state.inputKeyName
    inputKeyName = inputKeyName.trim().toLowerCase()

    if (inputKeyName === "") {
      Alert.alert("Error:", "Key is empty")
      return
    }

    let sql = "SELECT * FROM password_key WHERE passwordKey_folder = ? and passwordKey_key = ? "
    let results = null;
    try {
      results = await executeQuery(sql, [inputFolderName, inputKeyName])
      if (results.rows.length === 1) {
        Alert.alert("Error:", "Key already Exist")
      } else {
        await this.insertKey()
      }
    } catch (err) {
      // console.log(err)
    }
  }

  insertKey = async () => {

    let inputFolderName = this.state.password_folder
    inputFolderName = inputFolderName.trim().toLowerCase()
    let inputKeyName = this.state.inputKeyName
    inputKeyName = inputKeyName.trim().toLowerCase()

    let sql = "INSERT INTO password_key(passwordKey_folder, passwordKey_key ) VALUES( ? , ? )"

    let result = null;
    try {
      let results = await executeQuery(sql, [inputFolderName, inputKeyName])
      Alert.alert("Success:", "Added Successfully")
      this.setState({
        formSubmitError: '',
        formSubmitSuccess: '',
        inputKeyName: ''
      }, () => {
        this.getKeyList()
      })
    } catch (err) {
      // console.log("Promise -> Error: ");
      // console.log(err)
    }

  }

  async getKeyList() {
    let sql = "SELECT passwordKey_key FROM password_key WHERE passwordKey_folder = ? ORDER BY passwordKey_key ASC"

    let results = null;
    try {
      let tempArray = []

      results = await executeQuery(sql, [this.state.password_folder])
      // console.log("Promise -> Success: ");
      // console.log(results);
      if (results.rows.length !== 0) {
        let rows = results.rows;
        for (let index = 0; index < results.rows.length; index++) {
          tempArray.push(rows.item(index))
        }
      }
      this.setState({
        passwordKeyList: tempArray,
        passwordKeyListLoading: false,
      })
      // console.log(tempArray)
    } catch (err) {
      // console.log("Promise -> Error: ");
      // console.log(err);
    }
  }

  async deleteKeyWarning(password_key) {
    Alert.alert(
      'Delete',
      "Are you sure do you want to delete key '" + password_key + "' ?",
      [
        {
          text: 'Cancel',
          onPress: () => {
            // console.log('Cancel Pressed')
          },
          style: 'No'
        },
        {
          text: 'Yes',
          onPress: async () => {
            this.deleteKey(password_key)
            // console.log(password_key)
          }
        }
      ],
      { cancelable: false }
    );
  }

  async deleteKey(password_key) {

    // console.log(password_key)

    let inputKeyName = password_key
    inputKeyName = inputKeyName.trim().toLowerCase()

    let inputFolderName = this.state.password_folder
    inputFolderName = inputFolderName.trim().toLowerCase()

    if (password_key === "") {
      alert("Unexpected Error")
    }

    let result_2 = false;
    let result_3 = false;

    let sql_2 = "DELETE FROM `password_key` WHERE `passwordKey_folder` = ? AND `passwordKey_key` = ? "
    try {
      let results = await executeQuery(sql_2, [inputFolderName, inputKeyName])
      result_2 = true
      // console.log("2 Deleted Successfully")
      // console.log(results)
    } catch (err) {
      // console.log("Promise -> Error: ");
      // console.log(err)
    }

    let sql_3 = "DELETE FROM `password_list` WHERE `passwordList_folder`=? AND `passwordList_key`=? "
    try {
      let results = await executeQuery(sql_3, [inputFolderName, inputKeyName])
      result_3 = true
      // console.log("3 Deleted Successfully")
      // console.log(results)
    } catch (err) {
      // console.log("Promise -> Error: ");
      // console.log(err)
    }

    if (result_2 && result_3) {
      Alert.alert("Key Deleted Successfully")
      this.getKeyList()
    } else {
      Alert.alert("Some unexpected Error Occur")
    }

  }

  renderFolderName() {
    return (
      <CardView>
        <View style={{
          backgroundColor: '#FFFFFF',
          paddingVertical: 5,
          paddingHorizontal: 10,
        }} >
          <Text style={{ opacity: 0.75 }} >Folder Name</Text>
          <Text>{this.state.password_folder}</Text>
        </View>
      </CardView>
    )
  }

  renderHeader() {
    return (
      <View>
        <View style={styles.Form} >

          <View style={styles.Field_View} >
            <Text style={styles.Field_Label} >Add Key</Text>
            <TextInput
              style={styles.Field_Input}
              placeholder="Ex: email, username, password, custom"
              value={this.state.inputKeyName}
              onChangeText={(t) => {
                this.setState({
                  inputKeyName: t
                })
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.doesKeyExist()
            }}
          >
            <Text style={styles.Field_Submit} >Add Key</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.title} >Key List</Text>

          {
            this.state.passwordKeyList.length === 0 && this.state.passwordKeyListLoading == false && (
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    paddingBottom: 20,
                  }}
                >No Keys Added.</Text>
              </View>
            )
          }
        </View>

      </View>
    )
  }

  renderKeyList() {

    const renderItem = ({ item }) => {
      return (
        <CardView
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={5}
          style={styles.keyList_CardView}
        >
          <View
            style={styles.keyList_View}
          >
            <TouchableOpacity
              style={styles.keyList_TouchableOpacity}
              onPress={() => this.deleteKeyWarning(item.passwordKey_key)}
            >
              <Image
                source={icons.icon_delete_forever}
                style={{
                  width: 25,
                  height:25,
                }}
                />
            </TouchableOpacity>
            <Text style={styles.keyList_Text} >{item.passwordKey_key}</Text>
          </View>
        </CardView>
      )
    }

    return (
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        data={this.state.passwordKeyList}
        keyExtractor={item => item.passwordKey_key}
        renderItem={renderItem}
        ListHeaderComponent={this.renderHeader()}
      />
    )
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
                  routes: [{ name: "PasswordList", params: { password_folder: this.state.password_folder } }],
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
                source={icons.icon_lock}
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
              >Password List</Text>
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
    let navigation = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>

        <View style={{ flex: 1 }}>

          {this.renderFolderName()}

          {/* Render Key List */}
          {this.renderKeyList()}

        </View>

        {/* S: Footer */}
        { this.renderFooter()}
        {/* S: Footer */}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  Form: {
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  Field_View: {
  },
  Field_Label: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  Field_Input: {
    borderWidth: 1,
    padding: 5,
    margin: 0,
    borderRadius: 0,
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  Field_Submit: {
    marginTop: 5,
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingVertical: 10,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: 0,
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },

  keyList_CardView: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 0,
  },
  keyList_View: {
    padding: 10,
    flexDirection: 'row-reverse'
  },
  keyList_TouchableOpacity: {
    flexDirection: 'row-reverse'
  },
  keyList_Icon: {
    fontSize: 25,
    marginHorizontal: 5
  },
  keyList_Text: {
    flex: 1
  }

});