// make sure path is given

//const LaunchSettings = require( '../util/LaunchSettings' );
const BaseCommand    = require( './BaseCommand' );
const DisplayStage   = require( '../stages/utility/DisplayStage' );

//const MongoReader = require( '../stages/in/MongoReader' );
const SQLiteReader = require( '../stages/in/SQLiteReader' );
const LaunchSettings = require( '../util/LaunchSettings' );
const NullOutput = require( '../stages/out/NullOutput' );

class HashDupeSizes extends BaseCommand {

  constructor(cb){
    super(cb);
  }

  validateInput(){
    console.log('HashDupeSizes->validateInput] Ok.');
  }

  getPipe(){
    console.log('HashDupeSizes->getPipe] Building HashDupeSizes pipe');
    return Promise.all([

      //MongoReader.createReadable({
      //  connectionUrl: 'mongodb://localhost:27017/fs-scripts',
      //  query: function(mClient){
      //    return mClient.getDupeFiles();
      //  }
      //}),
      //

      SQLiteReader.createReadable({
        'path': LaunchSettings.getDbString(),
        query: function(sqlClient){
          console.log('HashDupeSizes->getPipe] SQLiteReader.createReadable - Creating dupe file size query');
          return sqlClient.getDupeFiles();
        }
      }),

      DisplayStage.createTransform({
        formatter: function(file){
          return 'Duplicate file: ' + file.path;
        }
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

      NullOutput.createWritable()

    ]).catch((err) => {
      console.error('Error building pipe', err);
    });
  }

}

module.exports = HashDupeSizes;