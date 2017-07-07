// make sure path is given

const LaunchSettings = require( '../util/LaunchSettings' );
const BaseCommand    = require( './BaseCommand' );
const hashStage      = require( '../stages/analysis/HashStage' );
const displayStage   = require( '../stages/utility/DisplayStage' );

//const MongoReader = require( '../stages/in/MongoReader' );

const SQLite       = require( '../db/SQLite' );
const sqliteReader = require( '../stages/in/SQLiteReader' );
const sqliteWriter = require( '../stages/out/SQLiteWriter' );

class HashDupeSizes extends BaseCommand {

  constructor(cb){
    super(cb);
  }

  validateInput(){
    console.log('HashDupeSizes->validateInput] Ok.');
  }

  getPipe(){
    console.log('HashDupeSizes->getPipe] Building HashDupeSizes pipe');

    // init DB first so reader and writer can share the connection
    let sqlPath = LaunchSettings.getDbString();
    let sqlConn = new SQLite();

    return sqlConn.open(sqlPath).then(function(){

      return Promise.all([

        //mongoReader({
        //  connectionUrl: 'mongodb://localhost:27017/fs-scripts',
        //  query: function(mClient){
        //    return mClient.getDupeFiles();
        //  }
        //}),
        //

        sqliteReader({
          path: sqlPath,
          query( sqlClient ){
            console.log( 'HashDupeSizes->getPipe] SQLiteReader.createReadable - Creating dupe file size query' );
            return sqlClient.getDupeFiles();
          }
        }),

        //displayStage({
        //  formatter(file){
        //    return 'Hashing duplicate file: ' + file.path;
        //  }
        //}),

        hashStage({
          algo:    'md5',
          field:   'md5',
          threads: 1
        }),

        displayStage({
          stdout:    true,
          lineWidth: 120,
          dotSize:   200,
          header:    'creating hashes...',
          formatter(){ return '.'; }
        }),

        //displayStage({
        //  formatter(file){
        //    return 'Created hash: ' + file.md5;
        //  }
        //}),

        sqliteWriter({
          path: sqlPath,
          buildProcessor(sqlClient){
            return function(chunk){ return sqlClient.updateFileMd5(chunk); };
          }
        }),

        //elasticSearchWriter({
        //  host: '127.0.0.1',
        //  port: '9200',
        //  user: 'elastic',
        //  pass: 'changeme',
        //  index: 'files',
        //  esType: 'file'
        //})

        //mongoWriter({
        //  'connectionUrl': 'mongodb://localhost:27017/fs-scripts'
        //})

        //nullOutput()

      ]);
    }).catch((err) => {
      console.error('Error building pipe', err);
    });
  }

}

module.exports = HashDupeSizes;