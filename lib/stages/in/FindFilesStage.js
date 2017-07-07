const BaseInputStage = require('./BaseInputStage');

const fsStream = require('../../util/FilesystemStream');
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
    this.statDef('file_scan');
  }

  getReadable(){

    let self = this;
    let src = this.getConfig('inputs');

    console.log('FindFilesStage->getReadable] Creating filesystem stream from src: ' + src);
    return fsStream(src, {
      highWaterMark: 1
    }).on('data',function(){
      self.statInc('file_scan');
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