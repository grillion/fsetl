const BaseInputStage = require('./BaseInputStage');

class MongoReader extends BaseInputStage {

  constructor(config){
    super(config);
  }

  getReadable(){
    let config = this.getConfig();


  }

  /**
   *
   * @param config
   * @return {Stream}
   */
  static createReadable( config ){
    let _instance = new MongoReader(config);
    return _instance.getReadable();
  }
}

module.exports = MongoReader;