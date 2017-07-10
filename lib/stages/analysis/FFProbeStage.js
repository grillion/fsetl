const probe = require('node-ffprobe');
const parallel = require('parallel-transform');

const BaseAnalysisStage = require( './BaseAnalysisStage' );
const stats = require('../../util/StatsCollector');

/**
 * Accepts config values:
 *
 * algo : 'md5' is supported ATM
 * threads : number of concurrent threads
 * field : chunk's field to insert md5
 */
class FFProbeStage extends BaseAnalysisStage {

  constructor(config){
    super(config);
  }

  getTransform(){

    let fieldName = this.getConfig('field');

    return parallel(
      this.getConfig('threads'),
      function(chunk, cb){
        let self = this;
        probe(chunk.path, function(err, probe_result){
          if( err ){
            return cb(err);
          }
          stats.inc('ffprobe_lookup');
          chunk[fieldName] = probe_result[0];
          self.push(chunk);
          cb();
        });
      }
    );
  }

}

module.exports = function( config ){
  let _instance = new FFProbeStage(config);
  return _instance.getTransform();
};