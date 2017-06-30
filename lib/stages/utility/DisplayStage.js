const _ = require('lodash');
const BaseUtilityStage = require( './BaseUtilityStage' );
const stream = require('stream');

class DisplayStage extends BaseUtilityStage {

  constructor(config){
    super(config);
  }

  getTransform(){

    let config = this.getConfig();
    let formatter = config.formatter;

    return new stream.Transform({
      objectMode: true,
      highWaterMark: 1,
      write(chunk, encoding, next){
        'use strict';

        // Rewrite line
        //readline.clearLine( process.stdout, 0);
        //readline.cursorTo( process.stdout, 0);
        //
        //process.stdout.write(formatter(chunk));
        console.log( formatter(chunk) );

        this.push(chunk);
        next();
        return false;
      }
    });
  }

  static createTransform( config ){
    let _instance = new DisplayStage(config);
    return _instance.getTransform();
  }
}

module.exports = DisplayStage;