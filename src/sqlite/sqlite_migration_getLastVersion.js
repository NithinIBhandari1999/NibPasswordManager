import executeQuery from './sqlite_executeQuery';

export default async function migration_getLastVersion(){

    let version = -1;
    let sql = "SELECT MAX(migrations.migrations_version) AS 'migrations_max' FROM migrations"

    let results = null;
    try{
       results = await executeQuery(sql,[])
        // console.log("Promise -> Success: ");
        // console.log(results);
        version = 1

        if( results.rows.length === 1 ){
            let rows = results.rows;
            row = rows.item(0);
            version = row.migrations_max + 1
        } else {
            version = 1
        }

    } catch(err){
        // console.log("Promise -> Error: ");
        // console.log(err);
        version = -1;
    }
    // console.log(result);
    // console.log("version: " + version );
    // console.log("End");

    return version

}