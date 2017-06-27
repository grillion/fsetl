const vfs = require('vinyl-fs');
const BaseInputStage = require('./BaseInputStage');

/**
 * @typedef {StageConfig} FindFilesStageConfig
 * @property {String|Array<String>} inputs
 */

/**
 * @typedef {Object} VinylFsItem
 * @property {String} base
 * @property {String} cwd
 * @property {Array<String>} history
 * @property {Object} stat
 * @property {*} _contents
 * @property {Boolean} _isVinyl
 *
 * @method isDirectory
 *
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
    return vfs.src( this.getConfig('inputs'), {
      read: false
    });
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