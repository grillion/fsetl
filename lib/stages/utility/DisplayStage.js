const BaseUtilityStage = require( './BaseUtilityStage' );
const { Transform } = require('stream');
//import * as readline from 'readline';

//function writeScanProgress(currentPath) {
//  if(!isVerbose()){ return; }
//  process.stdout.write(`Processing: ${currentPath}`);
//}
//
//function clearScanProgress(){
//  if(!isVerbose()){ return; }
//  readline.clearLine(process.stdout, 0);
//  readline.cursorTo(process.stdout, 0);
//}

class DisplayStage extends BaseUtilityStage {

  constructor(config){
    super(config);
  }

  getTransform(){
    return new Transform( {
      writableObjectMode: true,
      transform( chunk, encoding, callback ) {
        //// Coerce the chunk to a number if necessary
        //chunk |= 0;
        //
        //// Transform the chunk into something else.
        //const data = chunk.toString( 16 );
        // Push the data onto the readable queue.
        console.log('chunk', chunk);
        callback( null, chunk );
      }
    });
  }

  static createTransform( config ){
    let _instance = new DisplayStage(config);
    return _instance.getTransform();
  }

}

module.exports = DisplayStage;