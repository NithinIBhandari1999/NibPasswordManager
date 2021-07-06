import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    Image
} from 'react-native';
import { icons } from "../../constants";
import CardView from 'react-native-cardview';
import { CommonMasterPasswordSet } from "../../assets/utils/PasswordFunction";
import { Constants_AsyncStorageKeys, Constants_Common } from "../../assets/utils/Constants";
import { CommonActions } from "@react-navigation/native";

export default class MasterPasswordSet extends Component {

    constructor(props) {
        super(props)
        console.log("MasterPasswordSet.js -> constructor")
        this.state = {
            contain_0_to_9: false,
            contain_A_to_Z: false,
            contain_a_to_z: false,
            contain_specialSymbol: false,
            contain_passwordMinimumLength: false,

            masterPasswordInput: "",
            masterPasswordSubmit: false,

            modalSubmitOpenStatus: false
        }
        console.log(Constants_Common, Constants_AsyncStorageKeys)
    }

    async componentDidMount() {
        // var a = CryptoJS.SHA256("Message");
        // console.log(a)
        // sha256( "nithinibhandari1999.github.io" + "Nithin" + "Hello+Developers+Ping+Me").then( hash => {
        //     console.log(hash);
        // })

        // sha256( "Hello Developers").then( hash => {
        //     console.log(hash);
        // })

        // await sha256( "Hello Developers")
        // this.onChangeTextPassword("Test+1234")
    }

    onChangeTextPassword = (t) => {

        var inputText = t
        var masterPasswordSubmit = false

        let contain_0_to_9 = false
        let contain_A_to_Z = false
        let contain_a_to_z = false
        let contain_specialSymbol = false
        let contain_passwordMinimumLength = false

        if (inputText.length >= 10) {
            contain_passwordMinimumLength = true
        }

        for (let index = 0; index < inputText.length; index++) {
            const element = inputText.charCodeAt(index);
            if (element >= 48 && element <= 57) {
                // console.log("contain_0_to_9 (" + inputText[index] + ") (" + element + "):" + true)
                contain_0_to_9 = true
            } else if (element >= 65 && element <= 90) {
                // console.log("contain_A_to_Z (" + inputText[index] + ") (" + element + "):" + true)
                contain_A_to_Z = true
            } else if (element >= 97 && element <= 122) {
                // console.log("contain_a_to_z (" + inputText[index] + ") (" + element + "):" + true)
                contain_a_to_z = true
            } else {
                // console.log("contain_specialSymbol (" + inputText[index] + ") (" + element + "):" + true)
                contain_specialSymbol = true
            }
        }

        if (contain_0_to_9 && contain_A_to_Z && contain_a_to_z && contain_specialSymbol && contain_passwordMinimumLength) {
            masterPasswordSubmit = true
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
            masterPasswordSubmit
        })
    }

    onSubmit = async () => {
        this.setState({
            modalSubmitOpenStatus: true
        })
    }

    setMasterPassword = async () => {
        let masterPasswordInput = this.state.masterPasswordInput
        try {
            const result = await CommonMasterPasswordSet(masterPasswordInput)
            if (result === "S") {
                
                // Go to Login
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "MasterPasswordVerify" }],
                    })
                )

            } else {
                Alert.alert("Error:", "Some unexpected error occur, Please try again.")
            }
        } catch (err) {
            console.log(err)
            Alert.alert("Error:", "Some unexpected error occur, Please try again.")
        }
    }

    render() {
        let navigation = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalSubmitOpenStatus}
                >
                    <View style={{ margin: 40, flex: 1, justifyContent: 'center' }} >
                        <CardView
                            style={{ padding: 20, borderWidth: 1, backgroundColor: "#ffffff" }}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Info</Text>
                            <Text>You cannot change your Master Password in future.</Text>
                            <Text>If you forgot your Master Password then there is no way to recover your other passwords because all password are encrypted based on your current Master Password.</Text>
                            <Text>So please remember your password.</Text>
                            <Text>Store your Master Password in some secure place.</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 40 }} >
                                <CardView style={{
                                    marginLeft: 10
                                }} >
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "red"
                                        }}
                                        onPress={()=>{
                                            this.setState({
                                                modalSubmitOpenStatus: false
                                            })
                                        }}
                                    >
                                        <Text
                                            style={{
                                                padding: 10,
                                                color: "#FFFFFF",
                                                fontWeight: 'bold'
                                            }}
                                        >Cancel</Text>
                                    </TouchableOpacity>
                                </CardView>

                                <CardView style={{
                                    marginLeft: 10
                                }} >
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "green"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                padding: 10,
                                                color: "#FFFFFF",
                                                fontWeight: 'bold'
                                            }}
                                            onPress={()=>{
                                                this.setMasterPassword()
                                            }}
                                        >Proceed</Text>
                                    </TouchableOpacity>
                                </CardView>

                            </View>

                        </CardView>
                    </View>
                </Modal>

                <ScrollView>
                    <View>

                        <View style={{ padding: 20 }} >

                            <Text
                                style={{
                                    marginTop: 50,
                                    marginBottom: 30,
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >Set Password</Text>

                            <CardView style={{ marginTop: 20 }} >
                                <TextInput
                                    style={{ padding: 11 }}
                                    value={this.state.masterPasswordInput}
                                    onChangeText={(t) => {
                                        this.onChangeTextPassword(t);
                                    }}
                                    placeholder="Enter Master Password"
                                />
                            </CardView>

                            <Text style={{ padding: 10 }} >Password cannot be changed in future.</Text>

                            <View>

                                <CardView style={styles.passwordVerifyResult_cardView} >
                                    <Image
                                        source={(this.state.contain_A_to_Z) ? icons.icon_check : icons.icon_close}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            margin: 5,
                                        }}
                                        />
                                    <View style={styles.passwordVerifyResult_text} >
                                        <Text>Capital Letter (atleast one)</Text>
                                    </View>
                                </CardView>

                                <CardView style={styles.passwordVerifyResult_cardView} >
                                    <Image
                                        source={(this.state.contain_a_to_z) ? icons.icon_check : icons.icon_close}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            margin: 5,
                                        }}
                                        />
                                    <View style={styles.passwordVerifyResult_text} >
                                        <Text>Small Letter (atleast one)</Text>
                                    </View>
                                </CardView>

                                <CardView style={styles.passwordVerifyResult_cardView} >
                                    <Image
                                        source={(this.state.contain_0_to_9) ? icons.icon_check : icons.icon_close}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            margin: 5,
                                        }}
                                        />
                                    <View style={styles.passwordVerifyResult_text} >
                                        <Text>Number (atleast one)</Text>
                                    </View>
                                </CardView>

                                <CardView style={styles.passwordVerifyResult_cardView} >
                                    <Image
                                        source={(this.state.contain_specialSymbol) ? icons.icon_check : icons.icon_close}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            margin: 5,
                                        }}
                                    />
                                    <View style={styles.passwordVerifyResult_text} >
                                        <Text>Special Symbol (atleast one)</Text>
                                    </View>
                                </CardView>

                                <CardView style={styles.passwordVerifyResult_cardView} >
                                    <Image
                                        source={(this.state.contain_passwordMinimumLength) ? icons.icon_check : icons.icon_close}
                                        style={{
                                            width: 25,
                                            height: 25,
                                            margin: 5,
                                        }}
                                    />
                                    <View style={styles.passwordVerifyResult_text} >
                                        <Text>Minimum Length should be 10</Text>
                                    </View>
                                </CardView>

                            </View>

                            <CardView style={{ marginVertical: 30 }}>
                                <TouchableOpacity
                                    disabled={this.state.masterPasswordSubmit ? false : true}
                                    style={{ backgroundColor: 'black', flex: 1 }}
                                    onPress={() => this.onSubmit()}
                                >
                                    <Text
                                        style={{
                                            color: (this.state.masterPasswordSubmit) ? "#FFFFFF" : "grey",
                                            textAlign: 'center',
                                            margin: 10,
                                        }}
                                    >Set Master Password</Text>
                                </TouchableOpacity>
                            </CardView>

                        </View>

                    </View>
                </ScrollView>

                {/* S: Footer */}
                <View>

                </View>
                {/* E: Footer */}

            </View>
        )
    }

}

const styles = StyleSheet.create({

    passwordVerifyResult_cardView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        margin: 1,
        borderRadius: 0
    },
    passwordVerifyResult_icon: {
        fontSize: 30,
        padding: 10
    },
    passwordVerifyResult_text: {
        flex: 1
    },

});