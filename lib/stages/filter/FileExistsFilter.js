const BaseFilterStage = require( './BaseFilterStage' );
const stats = require( '../../util/StatsCollector' );
const miss = require('mississippi');
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
  }

  getTransform(){
    let keepMissing = this.getConfig('keepMissing', false);

    // Keep missing files
    return miss.through.obj( function(file, enc, cb){
      stats.inc('file_exists');
      fs.access( file.path, err => {
        if( err && keepMissing || !err && !keepMissing ){ this.push(file); }
        return cb();
      });
    });

  }
}

module.exports = function( config ){
  let _instance = new FileExistsFilter(config);
  return _instance.getTransform();
};