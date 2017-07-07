const _ = require('lodash');
const BaseFilterStage = require( './BaseFilterStage' );
const through2 = require('through2');
const fs = require( 'graceful-fs' );

/**
 * Accepts config values:
 *
 * algo : 'md5' is supported ATM
 * threads : number of concurrent threads
 * field : chunk's field to insert md5
 */
class FileExistsFilter extends BaseFilterStage {

  constructor(config){
    super(config);
    this.statDef('file_exists');
  }

  getTransform(){
    let self = this;
    return through2.obj( function(file, enc, cb){
      console.log('FileExistsFilter->transform]');
      fs.access( file.path, err => {
        if( err ){
          self.statInc('file_exists');
          this.push(file);
        }
        return cb();
      });
    });
  }
}

module.exports = function( config ){
  let _instance = new FileExistsFilter(config);
  return _instance.getTransform();
};