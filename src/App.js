import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  Button
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

//
import CustomDrawerComponent from "./components/layouts/CustomNavigationDrawer"
import SettingUp from './components/pages/SettingUp'
import SplashScreen from './components/pages/SplashScreen'

import MasterPasswordSet from './components/pages/MasterPasswordSet'
import MasterPasswordVerify from './components/pages/MasterPasswordVerify'

// 
import About from "./components/pages/About"

import FileImport from './components/ExportImport/FileImport'
import FileExport from './components/ExportImport/FileExport'

import FolderAdd from './components/password/FolderAdd'
import FolderList from './components/password/FolderList'
import PasswordList from './components/password/PasswordList'
import KeyList from './components/password/KeyList'

const App = (props) => {

    const Drawer = createDrawerNavigator();

    return (
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={ (props) => <CustomDrawerComponent {...props} /> }
          drawerStyle={{
            width: "80%",
          }}
        >
          <Drawer.Screen name="SplashScreen" component={ SplashScreen } options={{ swipeEnabled: false }} />
          <Drawer.Screen name="MasterPasswordSet" component={ MasterPasswordSet } options={{ swipeEnabled: false }} />
          <Drawer.Screen name="MasterPasswordVerify" component={ MasterPasswordVerify } options={{ swipeEnabled: false }} />
          <Drawer.Screen name="SettingUp" component={ SettingUp } options={{ swipeEnabled: false }} />

          <Drawer.Screen name="About" component={About} />
          <Drawer.Screen name="FileImport" component={FileImport} />
          <Drawer.Screen name="FileExport" component={FileExport} />

          <Drawer.Screen name="FolderList" component={FolderList} />
          <Drawer.Screen name="FolderAdd" component={FolderAdd} />
          <Drawer.Screen name="KeyList" component={KeyList} />
          <Drawer.Screen name="PasswordList" component={PasswordList} />

        </Drawer.Navigator>

    </NavigationContainer>
    )

}

const styles = StyleSheet.create({
  
});

export default App;