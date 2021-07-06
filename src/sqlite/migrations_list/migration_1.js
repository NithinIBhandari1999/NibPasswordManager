import executeQuery from '../sqlite_executeQuery';
import migration_insert from '../sqlite_migration_insert';

// ----- ----- ----- -----
// Common Variable
const MIGRATION_VERSION = 1;

// ----- ----- ----- -----
// Function List
async function createTable_password_folder(){

    let sql = ""
    sql += "CREATE TABLE IF NOT EXISTS password_folder( password_folder varchar(500) PRIMARY KEY )"

    let result = null;
    try{
        let results = await executeQuery(sql,[])
        migration_insert( MIGRATION_VERSION , sql )
        console.log( "src/sqlite/migrations_list/migration_1.js: " + "Promise -> Success: " );
        console.log(results);
    } catch(err){
        console.log("Promise -> Error: ");
        console.log(err);
    }
}

async function createTable_password_key(){

    let sql = ""
    sql += "CREATE TABLE IF NOT EXISTS password_key( " 
    sql += "    passwordKey_folder varchar(500), " 
    sql += "    passwordKey_key varchar(500), " 
    sql += "    UNIQUE( passwordKey_folder , passwordKey_key ) " 
    sql += ")"

    let result = null;
    try{
        let results = await executeQuery(sql,[])
        console.log( "src/sqlite/migrations_list/migration_1.js: " + "Promise -> Success: ");
        console.log(results);
        migration_insert( MIGRATION_VERSION , sql )
    } catch(err){
        console.log("Promise -> Error: ");
        console.log(err);
    }
}

async function createTable_password_list(){

    let sql = ""
    sql += "CREATE TABLE IF NOT EXISTS password_list( " 
    sql += "    passwordList_folder varchar(500), " 
    sql += "    passwordList_key varchar(500), " 
    sql += "    passwordList_password varchar(500), "
    sql += "    passwordList_datetime datetime, "
    sql += "    UNIQUE( passwordList_folder , passwordList_key, passwordList_password, passwordList_datetime ) " 
    sql += ")"

    let result = null;
    try{
        let results = await executeQuery(sql,[])
        console.log( "src/sqlite/migrations_list/migration_1.js: " + "Promise -> Success: ");
        console.log(results);
        migration_insert( MIGRATION_VERSION , sql )
    } catch(err){
        console.log("Promise -> Error: ");
        console.log(err);
    }
}

async function createTable_favorite(){

    let sql = ""
    sql += "CREATE TABLE IF NOT EXISTS favorite( " 
    sql += "    favorite_folder varchar(500), " 
    sql += "    UNIQUE( favorite_folder ) " 
    sql += ")"

    let result = null;
    try{
        let results = await executeQuery(sql,[])
        console.log( "src/sqlite/migrations_list/migration_1.js: " + "Promise -> Success: ");
        console.log(results);
        migration_insert( MIGRATION_VERSION , sql )
    } catch(err){
        console.log("Promise -> Error: ");
        console.log(err);
    }
}

// ----- ----- ----- -----
// Function Combile
export async function function_combile(){
    await createTable_password_folder();
    await createTable_password_key();
    await createTable_password_list();
    await createTable_favorite();
}

// ----- ----- ----- -----
// Function Execute
// await function_combile();