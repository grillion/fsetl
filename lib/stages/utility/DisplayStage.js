const BaseUtilityStage = require( './BaseUtilityStage' );
const through2 = require('through2');

class DisplayStage extends BaseUtilityStage {

  constructor(config){
    super(config);
  }

  getTransform(){

    let config    = this.getConfig();
    let formatter = config.formatter;
    let itemCount = 0; // Print a dot for each time we reach {dotSize} items
    let rowX      = 0; // until the line is {lineWidth} long and add a new line

    if(config.stdout){
      return through2.obj(function( chunk, enc, cb ){
        // If this time we need to draw a dot, then do the rest
        if( ++itemCount % config.dotSize === 0 ){
          process.stdout.write( formatter( chunk ) );
          if( ++rowX % config.lineWidth === 0 ){
            process.stdout.write( '\n' );
          }
        }
        this.push( chunk );
        return cb( null );
      },function(cb){
        process.stdout.write( '\n' );
        cb();
      });
    }

    return through2.obj(
      {highWaterMark: 1},
      function(chunk, enc, cb){
        console.log( formatter( chunk ) );
        this.push( chunk );
        return cb( null );
      }
    );
  }

  static createTransform( config ){
    let _instance = new DisplayStage(config);
    return _instance.getTransform();
  }
}

module.exports = DisplayStage;