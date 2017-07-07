const BaseFilterStage = require( './BaseFilterStage' );
const stats = require( '../../util/StatsCollector' );
const miss = require('mississippi');
const fs = require( 'graceful-fs' );

/**
 * Accepts config values:
 *
 * keepLinks : true - keep links instead of dropping links
 */
class SymlinkFilter extends BaseFilterStage {

  constructor(config){
    super(config);
  }

  getTransform(){
    let keepLinks = this.getConfig('keepLinks', false);

    if( keepLinks ){
      // Keep only symlinks
      return miss.through.obj( function( file, enc, cb ){
        if( file.stats.isSymbolicLink() ){
          stats.inc( 'sym_keep' );
          this.push( file );
        }
        return cb();
      } );
    } else {
      // Skip symlinks
      return miss.through.obj( function( file, enc, cb ){
        if( file.stats.isSymbolicLink() ){
          stats.inc( 'sym_skip' );
          return cb();
        }
        this.push( file );
        return cb();
      } );
    }



  }
}

module.exports = function( config ){
  let _instance = new SymlinkFilter(config);
  return _instance.getTransform();
};