const BaseUtilityStage = require( './BaseUtilityStage' );
const map = require('map-stream');
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
    return map(function(file, cb){
      console.log('DisplayStage] File: ', file.path );
      cb(null, file);
    });
  }

  static createTransform( config ){
    let _instance = new DisplayStage(config);
    return _instance.getTransform();
  }

}

module.exports = DisplayStage;
