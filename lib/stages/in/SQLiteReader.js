const BaseInputStage = require('./BaseInputStage');

class SQLiteReader extends BaseInputStage {

  constructor(config){
    super(config);
  }

  getReadable(){

    //return vfs.src( this.getConfig('inputs') );
  }

  /**
   *
   * @param config
   * @return {Stream}
   */
  static createReadable( config ){
    let _instance = new SQLiteReader(config);
    return _instance.getReadable();
  }
}

module.exports = SQLiteReader;