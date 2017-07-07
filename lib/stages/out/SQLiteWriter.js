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
    let processor = config.buildProcessor(sqlConn);

    return sqlConn.open(config.path).then(() => {
      return new stream.Writable({
        objectMode: true,
        highWaterMark: 1,
        write(file, encoding, next) {
          processor(file)
            .then(function(){ return next(); })
            .catch(function(err){ next(err); });
        },
        final(cb){
          console.log('SQLiteWriter->final] Closing DB');
          sqlConn.closeDb();
          cb();
        }
      });
    });
  }

}

module.exports = function( config ){
  let _instance = new SQLiteWriter(config);
  return _instance.getStream();
};