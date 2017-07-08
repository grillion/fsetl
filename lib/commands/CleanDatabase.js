const BaseCommand    = require( './BaseCommand' );
const LaunchSettings = require( '../util/LaunchSettings' );

// Connection
const sqlite         = require( '../db/SQLite' );

const sqliteReader = require( '../stages/in/SQLiteReader');
const displayStage = require( '../stages/utility/DisplayStage');
const fileExistsFilter = require( '../stages/filter/FileExistsFilter');
const sqliteWriter = require( '../stages/out/SQLiteWriter' );

class CleanDatabase extends BaseCommand {

  /**
   *
   */
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

  /**
   *
   * @return {Promise.<*>}
   */
  getConnections(){
    return Promise.all([
      sqlite( {path: LaunchSettings.getDbString()} )
    ]);
  }

  /**
   *
   * @param connections
   * @return {*}
   */
  getPipe( connections ){
    return Promise.all([

      sqliteReader({
        query(){
          console.log( 'CleanDatabase.sqliteReader.query] Creating files in path query' );
          return connections[0].getFilesInPath( LaunchSettings.getInputs() );
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

      //displayStage({ formatter(file){ return 'CleanDatabase] File is missing: ' + file.path; }}),

      sqliteWriter({
        processor(file){
          return connections[0].removeFile(file.path);
        }
      })

      //nullOutput()

    ]);
   }

}

module.exports = CleanDatabase;