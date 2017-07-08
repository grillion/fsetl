// make sure path is given
const BaseCommand    = require( './BaseCommand' );
const LaunchSettings = require( '../util/LaunchSettings' );

const sqlite = require('../db/SQLite');

const filesystemReader  = require( '../stages/in/FilesystemReader' );
const directoryFilter = require( '../stages/filter/DirectoryFilter' );
const symlinkFilter = require( '../stages/filter/SymlinkFilter' );
const displayStage    = require( '../stages/utility/DisplayStage' );
const sqliteWriter = require( '../stages/out/SQLiteWriter' );

//const elasticSearchWriter = require( '../stages/out/ElasticSearchWriter' );
//const mongoWriter = require( '../stages/out/MongoWriter' );

class IndexPath extends BaseCommand {

  validateInput(){
    if( !LaunchSettings.getInputs() ){
      process.stdout.write('IndexPath] A minimum of one input is required.\n');
      process.exit(1);
    }

    //if( !LaunchSettings.getDbString() ){
    //  process.stdout.write('IndexPath] Please provide a SQLite database path.\n');
    //  process.exit(1);
    //}
    //
    console.log('IndexPath->validateInput] Ok.');
  }

  getConnections(){
    return Promise.all([
      sqlite({ path: LaunchSettings.getDbString()} )
    ]);
  }

  getPipe(connections){

    console.log( 'IndexPath->getPipe] Building IndexPath pipe' );
    return Promise.all([

      // Crawl filesystem
      filesystemReader({
        inputs: LaunchSettings.getInputs()
      }),

      // Skip directories
      directoryFilter(),

      // Skip symlinks
      symlinkFilter(),

      displayStage({
        stdout:    true,
        lineWidth: 120,
        dotSize:   200,
        header:    'Scanning filesystem...',
        formatter(){ return '.'; }
      }),

      //elasticSearchWriter.createWritable({
      //  host: '127.0.0.1',
      //  port: '9200',
      //  user: 'elastic',
      //  pass: 'changeme',
      //  index: 'files',
      //  esType: 'file'
      //})

      //mongoWriter.createWritable({
      //  'connectionUrl': 'mongodb://localhost:27017/fs-scripts'
      //})

      sqliteWriter({
        processor(chunk) {
          return connections[0].indexFile( chunk );
        }
      })

    ]);
  }

}

module.exports = IndexPath;