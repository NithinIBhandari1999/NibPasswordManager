import executeQuery from './sqlite_executeQuery';
import createTableMigrations from './sqlite_createTableMigrations'
import migration_getLastVersion from './sqlite_migration_getLastVersion'

export default migrate = async (limit_version_max) => {   
    console.log('migrate -> Start')
    
    await createTableMigrations();

    let limit_version_min = await migration_getLastVersion();
    console.log('migrate -> limit_version_min: ' + limit_version_min)
    if( limit_version_max >= limit_version_min ){
        await migrate_execute( limit_version_min , limit_version_max );
    } else {
        console.log('Database Already Updated.')
    }
    console.log('migrate -> End')
}

let migrate_execute = async (limit_version_min , limit_version_max) => {
    for(let i=limit_version_min; i<=limit_version_max; i++ ){
        await migrate_list(i);
    }
}

const migrate_list = async (migrate_version) => {
       
    switch( migrate_version ){
        case 1:
            // await require('./migrations_list/migration_1')
            a = require('./migrations_list/migration_1')
            await a.function_combile();
            break;
        default:
            await console.error("Migration Not Defined: " + migrate_version );
            break;
    }

}