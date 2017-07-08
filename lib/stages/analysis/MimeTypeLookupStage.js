const mmm = require('mmmagic');
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
class MimeTypeLookupStage extends BaseAnalysisStage {

  constructor(config){
    super(config);
  }

  getTransform(){

    let fieldName = this.getConfig('field');

    let magic = new mmm.Magic( mmm.MAGIC_PRESERVE_ATIME | mmm.MAGIC_CONTINUE | mmm.MAGIC_MIME_TYPE );
    //let detectFile = promisify(magic.detectFile);

    return parallel(
      this.getConfig('threads'),
      function(chunk, cb){
        let self = this;
        magic.detectFile(chunk.path, function(err, mime_type){
          if( err ){
            return cb(err);
          }
          stats.inc('mime_lookup');
          chunk[fieldName] = mime_type[0];
          self.push(chunk);
          cb();
        });
      }
    );
  }

}

module.exports = function( config ){
  let _instance = new MimeTypeLookupStage(config);
  return _instance.getTransform();
};