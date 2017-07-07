// make sure path is given
const BaseCommand    = require( './BaseCommand' );
const DirectoryFilter   = require( '../stages/filter/DirectoryFilter' );
const DisplayStage   = require( '../stages/utility/DisplayStage' );
const FindFilesStage = require( '../stages/in/FindFilesStage' );

const SQLiteWriter = require( '../stages/out/SQLiteWriter' );
//const ElasticSearchWriter = require( '../stages/out/ElasticSearchWriter' );
//const MongoWriter = require( '../stages/out/MongoWriter' );
//const NullOutput = require( '../stages/out/NullOutput' );

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
      FindFilesStage.createReadable({
        inputs:    LaunchSettings.getInputs()
      }),

      // Skip directories
      DirectoryFilter.createTransform(),

      DisplayStage.createTransform({
        stdout:    true,
        lineWidth: 120,
        dotSize:   200,
        header:    'Scanning filesystem...',
        formatter(){ return '.'; }
      }),

      //ElasticSearchWriter.createWritable({
      //  host: '127.0.0.1',
      //  port: '9200',
      //  user: 'elastic',
      //  pass: 'changeme',
      //  index: 'files',
      //  esType: 'file'
      //})

      //MongoWriter.createWritable({
      //  'connectionUrl': 'mongodb://localhost:27017/fs-scripts'
      //})

      SQLiteWriter.createWritable({
        'path': LaunchSettings.getDbString(),
        buildProcessor(sqlClient){
          return function(chunk){ return sqlClient.addFile(chunk); };
        }
      })

      //NullOutput.createWritable()

    ]);
  }

}

module.exports = IndexPath;