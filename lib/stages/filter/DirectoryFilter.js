const BaseFilterStage = require( './BaseFilterStage' );
const through2 = require('through2');

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
    this.statDef('dir_skip');
  }

  getTransform(){
    let self = this;
    return through2.obj(
      function(file, enc, cb){
        if( file.stats.isDirectory()) {
          self.statInc('dir_skip');
          return cb();
        } else {
          this.push(file);
          return cb();
        }
      }
    );
  }
}

module.exports = function(config) {
  let _instance = new DirectoryFilter(config);
  return _instance.getTransform();
};