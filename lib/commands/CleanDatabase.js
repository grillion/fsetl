const BaseCommand    = require( './BaseCommand' );
const LaunchSettings = require( '../util/LaunchSettings' );

const sqliteReader = require( '../stages/in/SQLiteReader');
const displayStage = require( '../stages/utility/DisplayStage');
const nullOutput = require( '../stages/out/NullOutput' );

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
    return Promise.all([

      sqliteReader({
        path: LaunchSettings.getDbString(),
        query( sqlClient ){
          console.log( 'CleanDatabase->getPipe] SQLiteReader.createReadable - Creating files in path query' );
          return sqlClient.getFilesInPath( LaunchSettings.getInputs() );
        }
      }),

      displayStage({
        formatter(file){
          return 'Checking file: ' + file.path;
        }
      }),

      nullOutput()

    ]);
  }

}

module.exports = CleanDatabase;