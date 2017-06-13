const vfs = require('vinyl-fs');
const BaseInputStage = require('./BaseInputStage');

/**
 * @typedef {StageConfig} FindFilesStageConfig
 * @property {String|Array<String>} inputs
 */

class FindFilesStage extends BaseInputStage{

  /**
   *
   * @param {FindFilesStageConfig} config
   */
  constructor(config){
    super( config );
  }

  getReadable(){
    return vfs.src( this.getConfig('inputs') );
  }

  /**
   *
   * @param config
   * @return {Stream}
   */
  static createReadable( config ){
    let _instance = new FindFilesStage(config);
    return _instance.getReadable();
  }

}

module.exports = FindFilesStage;