const _ = require('lodash');
const BaseAnalysisStage = require( './BaseAnalysisStage' );
const stats = require('../../util/StatsCollector');
const parallel = require('parallel-transform');

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

    return parallel(
      config.threads,
      function(chunk, cb){
        let self = this;
        algos[config.algo](chunk.path)
          .then( hashValue => {
            stats.inc('md5_count');
            stats.inc('md5_bytes', chunk.size);

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

}

module.exports = function( config ){
  let _instance = new HashStage(config);
  return _instance.getTransform();
};