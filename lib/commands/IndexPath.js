// make sure path is given
const BaseCommand     = require( './BaseCommand' );
const directoryFilter = require( '../stages/filter/DirectoryFilter' );
const displayStage    = require( '../stages/utility/DisplayStage' );
const filesystemReader  = require( '../stages/in/FilesystemReader' );

const sqliteWriter = require( '../stages/out/SQLiteWriter' );
//const elasticSearchWriter = require( '../stages/out/ElasticSearchWriter' );
//const mongoWriter = require( '../stages/out/MongoWriter' );
//const nullOutput = require( '../stages/out/NullOutput' );

const LaunchSettings = require( '../util/LaunchSettings' );


class IndexPath extends BaseCommand {

  constructor(cb){
    super(cb);
  }

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

  getPipe(){
    console.log('IndexPath->getPipe] Building IndexPath pipe');
    return Promise.all([

      // Crawl filesystem
      filesystemReader({
        inputs:    LaunchSettings.getInputs()
      }),

      // Skip directories
      directoryFilter(),

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
        path: LaunchSettings.getDbString(),
        buildProcessor(sqlClient){
          return function(chunk){ return sqlClient.indexFile(chunk); };
        }
      })

      //nullOutput.createWritable()

    ]);
  }

}

module.exports = IndexPath;