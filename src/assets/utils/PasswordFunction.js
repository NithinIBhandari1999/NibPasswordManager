import { sha256 } from 'react-native-sha256';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants_AsyncStorageKeys , Constants_Common , getPasswordWithSalt } from "./Constants";
import CryptoJS from "react-native-crypto-js";

export async function CommonMasterPasswordSet( masterPassword ){
    let p = getPasswordWithSalt(masterPassword)
    let result = "";
    try {
        result = await sha256(p)
    } catch (err) {
        // console.log(err)
        return "NS"; // Not Successful
    }

    // console.log( "Hash: " + result)

    try {
        await AsyncStorage.setItem( Constants_AsyncStorageKeys.MasterPassword , result)
        await AsyncStorage.setItem( Constants_AsyncStorageKeys.MasterPasswordSetStatus , "true")
        // console.log("Stored in async")
        await CommonMasterPasswordVerify(masterPassword)
        return "S"; // Successful    
    } catch (error) {
        // console.log(error)
        return "NS"; // Not Successful
    }
}

export async function CommonMasterPasswordVerify(masterPassword){
    let p = getPasswordWithSalt(masterPassword)

    let resultHash = "";
    try {
        resultHash = await sha256(p)
        // console.log( "2 Hash: " + resultHash)
        // console.log( "p: " + p)
    } catch (err) {
        // console.log(err)
        return "NS"; // Not Successful
    }

    try {
        let masterPassword_get = await AsyncStorage.getItem(Constants_AsyncStorageKeys.MasterPassword)

        // console.log("masterPassword_get: " + masterPassword_get)
        if( resultHash === masterPassword_get ){
            // console.log("Correct Password")

            let MasterPasswordSetStatus = await AsyncStorage.getItem(Constants_AsyncStorageKeys.MasterPasswordSetStatus)
            // console.log("MasterPasswordSetStatus: " + MasterPasswordSetStatus)
            if(MasterPasswordSetStatus === "true"){
                // console.log("MasterPasswordSetStatus - T: " + MasterPasswordSetStatus)
            } else {
                // console.log("MasterPasswordSetStatus - F: " + MasterPasswordSetStatus)
            }

            return "S"
        } else {
            return "NS"; // Not Successful
        }
    } catch (error) {
        // console.log(error)
        return "NS"; // Not Successful
    }

}

export async function CommonEncryptPassword( originalText ) {
    let masterPassword = getPasswordWithSalt(global.passwordMaster)

    // console.log(masterPassword)

    let ciphertext = await CryptoJS.AES.encrypt(originalText, masterPassword).toString();
    // console.log("ciphertext: " + ciphertext)

    return ciphertext
}

export async function CommonDecryptPassword( ciphertext ) {
    let masterPassword = getPasswordWithSalt(global.passwordMaster)
    // console.log(masterPassword)

    let originalText = ""

    // Decrypt
    try{
        let bytes = await CryptoJS.AES.decrypt(ciphertext, masterPassword);
        originalText = await bytes.toString(CryptoJS.enc.Utf8);
        // console.log("originalText: " + originalText)
    } catch(err){
        // console.log(err)
    }

    return originalText
}

export async function ExportImport_EncryptPassword( originalText ) {
    let masterPassword = Constants_Common.MasterPasswordSaltExportImport

    // console.log(masterPassword)

    let ciphertext = await CryptoJS.AES.encrypt(originalText, masterPassword).toString();
    // console.log("ciphertext: " + ciphertext)

    return ciphertext
}

export async function ExportImport_DecryptPassword( ciphertext ) {
    let masterPassword = Constants_Common.MasterPasswordSaltExportImport
    // console.log(masterPassword)

    let originalText = ""

    // Decrypt
    try{
        let bytes = await CryptoJS.AES.decrypt(ciphertext, masterPassword);
        originalText = await bytes.toString(CryptoJS.enc.Utf8);
        // console.log("originalText: " + originalText)
    } catch(err){
        // console.log(err)
    }

    return originalText
}