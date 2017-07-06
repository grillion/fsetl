// make sure path is given

const LaunchSettings = require( '../util/LaunchSettings' );
const BaseCommand    = require( './BaseCommand' );
const DisplayStage   = require( '../stages/utility/DisplayStage' );

const SQLite = require('../db/SQLite');

//const MongoReader = require( '../stages/in/MongoReader' );
const SQLiteReader = require( '../stages/in/SQLiteReader' );
const HashStage = require('../stages/analysis/HashStage');
//const NullOutput = require( '../stages/out/NullOutput' );
const SQLiteWriter = require( '../stages/out/SQLiteWriter' );

class HashDupeSizes extends BaseCommand {

  constructor(cb){
    super(cb);
  }

  validateInput(){
    console.log('HashDupeSizes->validateInput] Ok.');
  }

  getPipe(){
    console.log('HashDupeSizes->getPipe] Building HashDupeSizes pipe');

    // init DB first so it shares connection
    let sqlPath = LaunchSettings.getDbString();
    let sqlConn = new SQLite();

    return sqlConn.open(sqlPath).then(function(){
      return Promise.all([

        //MongoReader.createReadable({
        //  connectionUrl: 'mongodb://localhost:27017/fs-scripts',
        //  query: function(mClient){
        //    return mClient.getDupeFiles();
        //  }
        //}),
        //

        SQLiteReader.createReadable({
          path: sqlPath,
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

        HashStage.createTransform({
          algo: 'md5',
          field: 'md5',
          threads: 10
        }),

        DisplayStage.createTransform({
          formatter: function(file){
            return 'Created hash: ' + file.md5;
          }
        }),

        SQLiteWriter.createWritable({
          path: sqlPath,
          buildProcessor: function(sqlClient){
            return function(chunk){ return sqlClient.updateFileMd5(chunk); };
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

        //NullOutput.createWritable()

      ]).catch((err) => {
        console.error('Error building pipe', err);
      });
    });
  }

}

module.exports = HashDupeSizes;