import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, BackHandler, ScrollView, Image, Dimensions
} from 'react-native';
import { CommonActions } from "@react-navigation/native";
import NibPasswordManagerIcon from '../../assets/image/NibPasswordManagerIcon.png'
import { icons } from "../../constants"
import { FlatList } from 'react-native-gesture-handler';
import executeQuery from "../../sqlite/sqlite_executeQuery";
import CardView from 'react-native-cardview'
import { useIsDrawerOpen } from '@react-navigation/drawer';



export default class CustomDrawerComponent extends Component {

  constructor(props) {
    super(props)
    console.log("CustomDrawerComponent.js -> constructor")
    console.log("props", props)

    this.state = {
      folderList: [],
      folderListLoading: true,
      customWidth: 0
    }

  }

  componentDidMount() {
    console.log("componentDidMount")
  }

  componentDidUpdate(prevProps) {
    if( prevProps.state.history !== this.props.state.history ){
      console.log("Drawer is open")
      this.setFolderList()
    }
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

  renderHeader(){
    return (
      <View
          onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            console.log(x, y, width, height)
            this.state.customWidth = width
            console.log(this.state.customWidth)
          }}
        >

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
            <Image
              resizeMode={'contain'}
              style= {{ width: this.state.customWidth, height: this.state.customWidth}}
              source={NibPasswordManagerIcon}
            />
          </View>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "FolderList" }],
                })
              )
            }}
          >
            <Image
              source={icons.icon_home}
              style={{
                width: 20,
                height:20,
              }}
              />
            <Text style={styles.navItemText} >Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "FolderAdd" }],
                })
              )
            }}
            
          >
            <Image
              source={icons.icon_create_new_folder}
              style={{
                width: 20,
                height:20,
              }}
              />
            <Text style={styles.navItemText} >Add Folder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "FileImport" }],
                })
              )
            }}
          >
            <Image
              source={icons.icon_import}
              style={{
                width: 20,
                height:20,
              }}
              />
            <Text style={styles.navItemText} >Import</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "FileExport" }],
                })
              )
            }}
          >
            <Image
              source={icons.icon_export}
              style={{
                width: 20,
                height:20,
              }}
              />
            <Text style={styles.navItemText} >Export</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "About" }],
                })
              )
            }}
          >
            <Image
              source={icons.icon_info}
              style={{
                width: 20,
                height:20,
              }}
              />
            <Text style={styles.navItemText} >About</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              BackHandler.exitApp();
            }}
          >
            <Image
              source={icons.icon_exit_to_app}
              style={{
                width: 20,
                height:20,
              }}
              />
            <Text style={styles.navItemText} >Exit</Text>
          </TouchableOpacity>

          {/* Folder List */}
          {
            (this.state.folderList.length !== 0 ) && (
              <View>
                <View style={{
                  margin: 5,
                  paddingBottom: 1,
                  backgroundColor: 'gray',
                  opacity: 0.2
                }} ></View>

                <Text
                style={{
                  padding: 10
                }}
                >Folder List</Text>     
              </View>
            )
          }

        </View>
    )
  }

  renderFolderList(){

    const renderItem = ({item , index})=>{
      return(
        <TouchableOpacity
          key={item.password_folder}
          style={{
            padding: 0,
            backgroundColor: '#f7f8f9',
            marginHorizontal: 10,
            marginBottom: 1,
          }}
        >
          <Text
            onPress={() => {
              this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "PasswordList", params: { password_folder: item.password_folder } }],
                })
              )
            }}
            style={{ padding: 10 , opacity: 0.75 }}
          >{(index+1)}. {item.password_folder}</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View>
        <FlatList
          data={this.state.folderList}
          keyExtractor={item => item.password_folder}
          renderItem={renderItem}
          ListHeaderComponent={ this.renderHeader() }
          style={{
            marginBottom: 10
          }}
          />
      </View>
    )
  }

  render() {

    return (
      <View>
        { this.renderFolderList() }
      </View>
    )
  }

}

const styles = StyleSheet.create({

  nav: {
    flex: 1
  },

  navHeader: {
    padding: 10,
    backgroundColor: '#000000',
    borderBottomColor: '#444',
    minHeight: 150,
  },
  navHeaderText: {
    fontSize: 20,
    color: 'white',
    letterSpacing: 0.7
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  navItemText: {
    paddingLeft: 10,
    fontSize: 15
  },

});