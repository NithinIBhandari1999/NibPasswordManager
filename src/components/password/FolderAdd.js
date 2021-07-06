import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
  Image,
} from 'react-native';
import { icons } from "../../constants"
import { GlobalStyle } from '../../assets/style/GlobalStyle';
import { CommonActions } from "@react-navigation/native";
import Toast from 'react-native-simple-toast'

// Sqlite
import executeQuery from "../../sqlite/sqlite_executeQuery";

export default class FolderAdd extends Component {

  constructor(props) {
    super(props)
    console.log("FolderAdd.js -> constructor")
    this.state = {
      inputFolderName: '',
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
  
  doesPasswordFolderExist = async () => {
    let inputFolderName = this.state.inputFolderName
    inputFolderName = inputFolderName.trim().toLowerCase()

    if(inputFolderName === ""){
      Toast.show("Folder Name is Empty")
      return
    }

    let sql = "SELECT password_folder FROM password_folder WHERE password_folder= ?"

    let results = null;
    try{
        results = await executeQuery(sql,[inputFolderName])
        if( results.rows.length === 1 ){
          Toast.show("Folder Name already Exist")
        } else {
          await this.insertPasswordFolder()
        }
    } catch(err){
      console.log(err)
    }
  }

  insertPasswordFolder = async () => {

    let inputFolderName = this.state.inputFolderName
    inputFolderName = inputFolderName.trim().toLowerCase()

    let sql = "INSERT INTO password_folder(password_folder ) VALUES( ? )"

    let result = null;
    try{
       let results = await executeQuery(sql, [inputFolderName])
       this.setState({
        inputFolderName: ""
      })
      Toast.show("Added Successfully", Toast.LONG)
    } catch(err){
        console.log("Promise -> Error: ");
        console.log(err)
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
    let navigation = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>

        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View>

            <View style={styles.Form} >

              <View style={styles.Field_View} >
                <Text style={styles.Field_Label} >Enter Folder Name</Text>
                
                <TextInput
                  style={styles.Field_Input}
                  placeholder="Ex: Google.com - example@gmail.com"
                  value={this.state.inputFolderName}
                  onChangeText={(t) => {
                    this.setState({
                      inputFolderName: t
                    })
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={()=>{
                  this.doesPasswordFolderExist()
                }}
              >
                <Text style={styles.Field_Submit} >Add Folder</Text>
              </TouchableOpacity>
              
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
    marginVertical: 20,
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

});