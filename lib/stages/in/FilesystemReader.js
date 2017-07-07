const BaseInputStage = require('./BaseInputStage');
const stats = require('../../util/StatsCollector');

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

class FilesystemReader extends BaseInputStage{

  /**
   *
   * @param {FindFilesStageConfig} config
   */
  constructor(config){
    super( config );
  }

  getReadable(){

    let src = this.getConfig('inputs');

    console.log('FindFilesStage->getReadable] Creating filesystem stream from src: ' + src);
    return fsStream(src, {
      highWaterMark: 1
    }).on('data',function(){
      stats.inc('file_scan');
    });
  }
}

module.exports = function( config ){
  let _instance = new FilesystemReader(config);
  return _instance.getReadable();
};