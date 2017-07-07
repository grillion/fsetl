const BaseFilterStage = require( './BaseFilterStage' );
const through2 = require('through2');
const stats = require('../../util/StatsCollector');
const fs = require('graceful-fs');
/**
 * Accepts config values:
 *
 * algo : 'md5' is supported ATM
 * threads : number of concurrent threads
 * field : chunk's field to insert md5
 */
class DirectoryFilter extends BaseFilterStage {

  constructor(config){
    super(config);
  }

  getTransform(){
    return through2.obj(
      function(file, enc, cb){

        if( file.stats.isDirectory()){
          stats.inc( 'dir_skip' );
          return cb();
        }
        this.push(file);
        return cb();
      }
    );
  }
}

module.exports = function(config) {
  let _instance = new DirectoryFilter(config);
  return _instance.getTransform();
};