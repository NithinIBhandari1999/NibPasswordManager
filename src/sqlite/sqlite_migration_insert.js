import executeQuery from './sqlite_executeQuery';

export default async function migration_insert( migrations_version, migrations_sql  ){

    let operation_status = false;
    let sql = "INSERT INTO migrations(migrations_version, migrations_sql ) VALUES( ? , ? )"

    let result = null;
    try{
       let results = await executeQuery(sql,[migrations_version, migrations_sql ])
        console.log("Promise -> Success: ");
        console.log(results);
        operation_status = true
    } catch(err){
        console.log("Promise -> Error: ");
        console.log(err);
        operation_status = false
    }

    return operation_status

}