const _ = require('lodash');
const BaseOutputStage = require('./BaseOutputStage');
const stream = require('stream');
const SQLite = require('../../db/SQLite');

class SQLiteWriter extends BaseOutputStage {

  constructor(config){
    super(config);
  }

  getStream(){

    let config = this.getConfig();
    let sqlConn = new SQLite();

    console.log('SQLiteWriter->getWritable] Opening connection to SQLite DB: ' + config.path);
    return sqlConn.open(config.path).then(() => {
      return new stream.Writable({
        objectMode: true,
        highWaterMark: 1,
        write(file, encoding, next) {
          console.log('SQLiteWriter->write] Indexing file');

          // Fields:
          // stats.size
          // path
          return sqlConn.addFile(file)
            .then(function(){
              return next();
            }).catch(function(err){
              next(err);
            });
        },
        final(cb){
          console.log('SQLiteWriter->final] Closing DB');
          sqlConn.closeDb();
          cb();
        }
      });
    });
  }

  /**
   *
   * @param config
   * @return {Stream}
   */
  static createWritable( config ){
    let _instance = new SQLiteWriter(config);
    return _instance.getStream();
  }

}

module.exports = SQLiteWriter;