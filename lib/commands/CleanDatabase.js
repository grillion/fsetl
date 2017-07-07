const BaseCommand    = require( './BaseCommand' );
const LaunchSettings = require( '../util/LaunchSettings' );
const SQLite       = require( '../db/SQLite' );

const sqliteReader = require( '../stages/in/SQLiteReader');
const displayStage = require( '../stages/utility/DisplayStage');
const fileExistsFilter = require( '../stages/filter/FileExistsFilter');
const sqliteWriter = require( '../stages/out/SQLiteWriter' );
//const nullOutput = require( '../stages/out/NullOutput' );

class CleanDatabase extends BaseCommand {

  constructor(cb){
    super(cb);
  }

  validateInput(){
    if( !LaunchSettings.getInputs() ){
      process.stdout.write('CleanDatabase] A minimum of one input is required.\n');
      process.exit(1);
    }
    if( !LaunchSettings.getDbString() ){
      process.stdout.write('CleanDatabase] Please provide a SQLite database path.\n');
      process.exit(1);
    }
    console.log('CleanDatabase->validateInput] Ok.');
  }

  getPipe(){

    console.log('CleanDatabase->getPipe] Building IndexPath pipe');

    // init DB first so reader and writer can share the connection
    let sqlPath = LaunchSettings.getDbString();
    let sqlConn = new SQLite();

    return sqlConn.open(sqlPath).then(function(){

      return Promise.all([

        sqliteReader({
          path: LaunchSettings.getDbString(),
          query( sqlClient ){
            console.log( 'CleanDatabase.sqliteReader.query] Creating files in path query' );
            return sqlClient.getFilesInPath( LaunchSettings.getInputs() );
          }
        }),

        displayStage({
          stdout:    true,
          lineWidth: 120,
          dotSize:   200,
          header:    'checking filesystem...',
          formatter(){ return '.'; }
        }),

        // good for debug
        //displayStage({ formatter(file){ return 'Checking file: ' + file.path; }}),

        fileExistsFilter({ keepMissing: true }),

        displayStage({ formatter(file){ return 'CleanDatabase] File is missing: ' + file.path; }}),

        sqliteWriter({
          path: LaunchSettings.getDbString(),
          buildProcessor(sqlClient){
            return function(file){
              console.log('CleanDatabase.sqliteWriter.processor] Removing file: ' + file.path);
              return sqlClient.removeFile(file.path);
            };
          }
        }),

        //nullOutput()

      ]);
    }).catch((err) => {
      console.error('Error building pipe', err);
    });
   }

}

module.exports = CleanDatabase;