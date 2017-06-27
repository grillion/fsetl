const _ = require('lodash');
const BaseOutputStage = require('./BaseOutputStage');
const stream = require('stream');
const SQLite = require('../../db/SQLite');

class SQLiteWriter extends BaseOutputStage {

  constructor(config){
    super(config);


  }

  getWritable(){

    let config = this.getConfig();
    let sqlConn = new SQLite();

    console.log('SQLiteWriter->getWritable] Opening connection to SQLite DB: ' + config.path);
    return sqlConn.open(config.path).then(() => {
      return new stream.Writable({
        objectMode: true,
        write(file, encoding, next) {
          //console.log('SQLiteWriter->write] chunk', chunk);

          // Fields:
          // stats.size
          // path
          sqlConn.run('INSERT INTO files (path, size) VALUES ($path, $size)', {
            $path: file.path,
            $size: file.stats.size
          }).then(function(){
            next();
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
    return _instance.getWritable();
  }

}

module.exports = SQLiteWriter;