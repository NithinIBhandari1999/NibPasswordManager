import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  BackHandler,
  Image,
} from 'react-native';
import { icons } from "../../constants"
import { GlobalStyle } from '../../assets/style/GlobalStyle';
import CardView from 'react-native-cardview'
import executeQuery from "../../sqlite/sqlite_executeQuery";
import { CommonActions } from "@react-navigation/native";

export default class FolderList extends Component {

  constructor(props) {
    super(props)
    console.log("FolderList.js -> constructor")
    this.state = {
      folderList: [],
      folderListLoading: true
    }

    this.props.navigation.addListener(
      'focus',
      () => {
        console.log("a")
        this.setFolderList();
      }
    )
  }

  componentDidMount() {
    this.setFolderList();

    // Go Back
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      ()=>{

        Alert.alert("Exit", "Are you sure you want to Exit App?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "YES",
            onPress: () => BackHandler.exitApp() 
          }
        ]);
    
        return true;
      }
    );

  }

  componentWillUnmount() {

    // Go Back
    this.backHandler.remove();

  }

  async setFolderList() {
    console.log("setFolderList")

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

      this.setState({
        folderList: temp_password_folder_list,
        folderListLoading: false,
      })

    } catch (err) {
      this.setState({
        folderListLoading: false,
      })
      console.log("Promise -> Error: ");
      console.log(err);
    }
  }

  async deleteFolderWarning(password_folder) {
    Alert.alert(
      'Delete',
      "Are you sure do you want to delete folder '" + password_folder + "' ?",
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Pressed')
          },
          style: 'No'
        },
        {
          text: 'Yes',
          onPress: async () => {
            this.deleteFolder(password_folder)
          }
        }
      ],
      { cancelable: false }
    );
  }

  async deleteFolder(password_folder) {

    console.log(password_folder)

    let inputFolderName = password_folder
    inputFolderName = inputFolderName.trim().toLowerCase()

    if (password_folder === "") {
      alert("Unexpected Error")
    }

    let result_1 = false;
    let result_2 = false;
    let result_3 = false;

    let sql_1 = "DELETE FROM password_folder WHERE password_folder = ? "
    try {
      let results = await executeQuery(sql_1, [inputFolderName])
      result_1 = true
      console.log("1 Deleted Successfully")
      console.log(results)
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err)
    }

    let sql_2 = "DELETE FROM password_key WHERE passwordKey_folder = ? "
    try {
      let results = await executeQuery(sql_2, [inputFolderName])
      result_2 = true
      console.log("2 Deleted Successfully")
      console.log(results)
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err)
    }

    let sql_3 = "DELETE FROM password_list WHERE passwordList_folder = ? "
    try {
      let results = await executeQuery(sql_3, [inputFolderName])
      result_3 = true
      console.log("3 Deleted Successfully")
      console.log(results)
    } catch (err) {
      console.log("Promise -> Error: ");
      console.log(err)
    }

    if (result_1 && result_2 && result_3) {
      Alert.alert("Folder Deleted Successfully")
      this.setFolderList()
    } else {
      Alert.alert("Some unexpected Error Occur")
    }

  }

  renderHeader(){
    return (
      <View>
        <Text style={styles.title} >Folder List</Text>

        {
            this.state.folderList.length === 0 && this.state.folderListLoading == false && (
              <View>
                <Text style={{ textAlign: 'center', fontSize: 15, paddingBottom: 20, }} >No Folder Available.</Text>
                <TouchableOpacity style={{ display: 'flex', alignItems: 'center' }} >
                  <Text
                    style={{ borderRadius: 10, minWidth: 200, paddingVertical: 10, textAlign: 'center', backgroundColor: '#ffffff', fontWeight: 'bold' }}
                    onPress={() => {
                      this.props.navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: "FolderAdd" }],
                        })
                      )
                    }}
                  >Add Folder</Text>
                </TouchableOpacity>
              </View>
            )
          }

      </View>
    )
  }

  renderFolderList(){

    const renderItem = ({item})=>{
      return(
        <CardView
        style={styles.keyList_CardView}
        key={item.password_folder}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row-reverse',
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <TouchableOpacity
            style={{
              width: 35,
              height: 25,
              paddingHorizontal: 5,    
            }}
            onPress={() => {
              this.deleteFolderWarning(item.password_folder)
            }}
          >
            <Image
                source={icons.icon_delete_forever}
                style={{
                  width: 25,
                  height:25,
                }}
                />
          </TouchableOpacity>

          <View style={{ flex: 1 }} >
            <TouchableOpacity>
              <Text
                onPress={() => {
                  this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "PasswordList", params: { password_folder: item.password_folder } }],
                    })
                  )
                }}
                style={{ padding: 10 }}
              >{item.password_folder}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </CardView>
      )
    }

    return (
      <View>
        <FlatList
          data={this.state.folderList}
          keyExtractor={item => item.password_folder}
          renderItem={renderItem}
          ListHeaderComponent={ this.renderHeader() }
          />
      </View>
    )
  }

  renderFooter(){
    return(
      <CardView>
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
                    routes: [{ name: "FolderAdd" }],
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
                source={icons.icon_create_new_folder}
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
                >Add Folder</Text>
              </View>
            </TouchableWithoutFeedback>


        </View>
      </CardView>
    )
  }

  render() {
    
    return (
      <View style={{ flex: 1 }}>

        <View style={{ flex: 1 }}>
          { this.renderFolderList() }
        </View>

        {/* S: Footer */}
        <View>
          { this.renderFooter() }
        </View>
        {/* E: Footer */}

      </View>
    )
  }

}

const styles = StyleSheet.create({

  title: {
    textAlign: 'center',
    fontSize: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },

  keyList_CardView: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 0,
  },
  keyList_View: {
    flex: 1,
    flexDirection: 'row-reverse',
    padding: 0,
  },
  keyList_TouchableOpacity: {

  },
  keyList_Icon: {
    fontSize: 25,
    marginHorizontal: 5,
    padding: 10,
  },
  keyList_Text: {
    flex: 1
  }

});