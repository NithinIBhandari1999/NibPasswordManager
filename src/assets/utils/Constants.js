export const Constants_AsyncStorageKeys = {
    MasterPassword: "MasterPassword",
    MasterPasswordSetStatus: "MasterPasswordSetStatus"
}

export const Constants_Common = {
    MasterPasswordSalt1: "nithinibhandari1999.github.io+",
    MasterPasswordSalt2: "+HelloDeveloper",
    FolderName: "NibPasswordManager",
    MasterPasswordSaltExportImport: "++HelloDeveloper++",
}

export const getPasswordWithSalt = (password) => {
    return (Constants_Common.MasterPasswordSalt1 + password + Constants_Common.MasterPasswordSalt2)
}