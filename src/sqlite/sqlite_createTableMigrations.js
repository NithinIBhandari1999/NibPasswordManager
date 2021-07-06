import executeQuery from './sqlite_executeQuery';

export default async function createTableMigrations(){

    let sql = ""
    sql  = "CREATE TABLE IF NOT EXISTS migrations( "
    sql += "    migrations_version INTEGER, "
    sql += "    migrations_sql     TEXT,   "
    sql += "    UNIQUE( migrations_version, migrations_sql ) "
    sql += ")"

    let results = null;
    try{
        results = await executeQuery(sql,[])
        console.log("Promise -> Success: ");
        console.log(results);
    } catch(err){
        console.log("---- ---- ---- ----")
        console.error("Promise -> Error: ");
        console.error(err);
    }
}