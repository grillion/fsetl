const _ = require('lodash');
const BaseAnalysisStage = require( './BaseAnalysisStage' );
const through2c = require('through2-concurrent');

let algos = {
  md5 : require('md5-file/promise')
};

/**
 * Accepts config values:
 *
 * algo : 'md5' is supported ATM
 * threads : number of concurrent threads
 * field : chunk's field to insert md5
 */
class HashStage extends BaseAnalysisStage {

  constructor(config){
    super(config);
  }

  getTransform(){

    let config = this.getConfig();

    return through2c.obj(
      {maxConcurrency: config.threads},
      function(chunk, enc, cb){
        let self = this;
        algos[config.algo](chunk.path)
          .then( hashValue => {
            chunk[config.field] = hashValue;
            self.push(chunk);
            cb();
          })
          .catch( err => {
            cb(err);
          });
      }
    );
  }

  static createTransform( config ){
    let _instance = new HashStage(config);
    return _instance.getTransform();
  }
}

module.exports = HashStage;