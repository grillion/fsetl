// make sure path is given

const LaunchSettings = require( '../util/LaunchSettings' );
const BaseCommand    = require( './BaseCommand' );
const hashStage      = require( '../stages/analysis/HashStage' );
const displayStage   = require( '../stages/utility/DisplayStage' );

//const MongoReader = require( '../stages/in/MongoReader' );

const sqlite       = require( '../db/SQLite' );
const sqliteReader = require( '../stages/in/SQLiteReader' );
const sqliteWriter = require( '../stages/out/SQLiteWriter' );

class HashDupeSizes extends BaseCommand {

  validateInput(){
    console.log('HashDupeSizes->validateInput] Ok.');
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

  getPipe(connections){
    return Promise.all([

      sqliteReader({
        query(){
          console.log( 'HashDupeSizes->getPipe] SQLiteReader.createReadable - Creating dupe file size query' );
          return connections[0].getDupeFiles();
        }
      }),

      //displayStage({ formatter(file){ return 'Hashing duplicate file: ' + file.path; } }),

      hashStage({
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

      //displayStage({ formatter(file){ return 'Created hash: ' + file.md5; } }),

      sqliteWriter({
        processor(chunk){
          return connections[0].updateFileMd5(chunk);
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
  }
}

module.exports = HashDupeSizes;