const BaseInputStage = require('./BaseInputStage');
const SQLite = require('../../db/SQLite');
const from2 = require('from2');

class SQLiteReader extends BaseInputStage {

  constructor(config){
    super(config);
    this.statDef('sql_read');
  }

  getReadable(){

    let config = this.getConfig();
    let sqlConn = new SQLite();
    let self = this;

    if( !config.query ){
      return Promise.reject('SQLiteReader requires \'query\' config option');
    }
    return sqlConn.open(config.path)
      .then(sqlConn => {
        return config.query(sqlConn);
      })
      .then(( qResult ) => {

        return from2.obj(function(size, next){
          qResult.get().then( row => {
            self.statInc('sql_read');
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