const BaseInputStage = require('./BaseInputStage');
const miss = require('mississippi');
const stats = require('../../util/StatsCollector');

class SQLiteReader extends BaseInputStage {

  constructor(config){
    super(config);
  }

  getReadable(){

    let queryFunc = this.getConfig('query');

    if( !queryFunc ){
      return Promise.reject('SQLiteReader requires \'query\' config option');
    }

    // Create a readable stream from queryFunc's prepared statement
    return queryFunc().then( sqlStmt => {
      return miss.from.obj(function(size, next){
        sqlStmt.get().then( row => {
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