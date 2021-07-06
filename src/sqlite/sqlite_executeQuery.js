export default function executeQuery (sql, params = []){

    return new Promise((resolve, reject) => {
        db.transaction((trans) => {
            trans.executeSql(sql, params, (trans, results) => {
                resolve(results);
            },
            (error) => {
                // console.error("----- ----- ----- -----")
                // console.error("SQL: " + sql)
                // console.error(error)
                // console.error("----- ----- ----- -----")
                reject(error);
            });
        });
    });

}