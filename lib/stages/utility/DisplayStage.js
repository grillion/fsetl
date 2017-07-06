const _ = require('lodash');
const BaseUtilityStage = require( './BaseUtilityStage' );
const through2spy = require('through2-spy');
class DisplayStage extends BaseUtilityStage {

  constructor(config){
    super(config);
  }

  getTransform(){

    let config = this.getConfig();
    let formatter = config.formatter;

    return through2spy.obj(function(chunk){
      console.log( formatter(chunk) );
    });
  }

  static createTransform( config ){
    let _instance = new DisplayStage(config);
    return _instance.getTransform();
  }
}

module.exports = DisplayStage;