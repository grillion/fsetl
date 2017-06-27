const BaseOutputStage = require('./BaseOutputStage');
const stream = require('stream');
//const SQLiteWritable = require('../../db/SQLiteWritable');

class SQLiteWriter extends BaseOutputStage {

  constructor(config){
    super(config);
  }

  getWritable(){
    return new stream.Writable({
      objectMode: true,
      write: function(chunk, encoding, next) {
        console.log('SQLiteWriter->write] chunk', chunk);
        next();
      }
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