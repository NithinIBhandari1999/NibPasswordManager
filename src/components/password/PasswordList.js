import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  BackHandler,
  Image,
} from 'react-native';
import { icons } from "../../constants"
import { GlobalStyle } from '../../assets/style/GlobalStyle';
import { CommonActions } from "@react-navigation/native";
import PasswordListItem from './PasswordListItem'
import executeQuery from "../../sqlite/sqlite_executeQuery";
import CardView from 'react-native-cardview'

export default class PasswordList extends Component {

  constructor(props) {
    super(props)
    console.log("PasswordList.js -> constructor")

    this.state = {
      password_folder: this.props.route.params.password_folder,
      passwordKeyList: [],
      passwordKeyListLoading: true
    }
  }

  componentDidMount() {

    this.setState({
      password_folder: this.props.route.params.password_folder
    }),
    this.getKeyList();

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
        passwordKeyListLoading: false
      })
      // console.log(tempArray)
    } catch (err) {
      // console.log("Promise -> Error: ");
      // console.log(err);
    }
  }

  renderHeader(){

    if(this.state.passwordKeyList.length === 0 && this.state.passwordKeyListLoading == false ){
      return(
        <View>
          <Text style={ styles.title } >No Keys Available.</Text>
          <TouchableOpacity style={{ display: 'flex' , alignItems: 'center' }} >
            <Text
              style={{ borderRadius: 10, minWidth: 200, paddingVertical: 10, textAlign: 'center' , backgroundColor: '#ffffff', fontWeight: 'bold' }}
              onPress={() => {
                this.props.navigation.dispatch(
                  CommonActions.reset({
                      index: 0,
                      routes: [{ name: "KeyList", params: { password_folder: this.state.password_folder } }],
                  })
                )
              }
            }
            >Add Keys</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderPasswordList(){

    const renderItem = ({item})=>{
      // console.log(item)
      return (
        <View style={{ paddingHorizontal: 20, paddingVertical: 5 }} >
          <Text style={{ paddingBottom: 5, paddingLeft: 3, opacity: 0.75 }} >{item.passwordKey_key}</Text>
          <PasswordListItem password_folder={this.state.password_folder} password_key={item.passwordKey_key} />
        </View>
      )
    }
    
    return (
      <FlatList
        keyboardDismissMode="none"
        keyboardShouldPersistTaps={'always'}
        data={this.state.passwordKeyList}
        keyExtractor={item => item.passwordKey_key}
        renderItem={renderItem}
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
                  routes: [{ name: "KeyList", params: { password_folder: this.state.password_folder } }],
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
                source={icons.icon_key_chain}
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
              >Key List</Text>
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

        <View style={{ flex: 1 }}>

          { this.renderFolderName() }

          { this.renderHeader() }

          { this.renderPasswordList() }

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
    fontSize: 25,
    marginTop: 60,
    marginBottom: 40,
    marginHorizontal: 5,
  },

});