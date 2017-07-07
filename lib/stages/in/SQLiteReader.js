const BaseInputStage = require('./BaseInputStage');
const SQLite = require('../../db/SQLite');
const miss = require('mississippi');
const stats = require('../../util/StatsCollector');

class SQLiteReader extends BaseInputStage {

  constructor(config){
    super(config);
  }

  getReadable(){

    let config = this.getConfig();
    let sqlConn = new SQLite();

    if( !config.query ){
      return Promise.reject('SQLiteReader requires \'query\' config option');
    }
    return sqlConn.open(config.path)
      .then(sqlConn => {
        return config.query(sqlConn);
      })
      .then(( qResult ) => {

        return miss.from.obj(function(size, next){
          qResult.get().then( row => {
            stats.inc('sql_read');
            next( null, row || null );
          }).catch(function(err){
            next(err, null);
          });
        });
      })
      .catch(err => {
        console.error('SQLiteReader->getReadable] Error opening database', err );
      });
  }

}

module.exports = function( config ){
  let _instance = new SQLiteReader(config);
  return _instance.getReadable();
};