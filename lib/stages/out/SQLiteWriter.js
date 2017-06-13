const BaseOutputStage = require('./BaseOutputStage');
const SQLiteWritable = require('../../db/SQLiteWritable');

class SQLiteWriter extends BaseOutputStage {

  constructor(config){
    super(config);
  }

  getWritable(){
    return new SQLiteWritable();
    //return vfs.src( this.getConfig('inputs') );
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