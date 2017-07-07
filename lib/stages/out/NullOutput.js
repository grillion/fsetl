const BaseOutputStage = require('./BaseOutputStage');
const stream = require('stream');

class NullOutput extends BaseOutputStage {

  constructor(config){
    super(config);
  }

  getStream(){
    return new stream.Writable({
      objectMode: true,
      write(file, encoding, next) {
        next();
      },
      final(cb){
        console.log('NullOutput->final] End Of Stream');
        cb();
      }
    });
  }

}

module.exports = function( config ){
  let _instance = new NullOutput(config);
  return _instance.getStream();
};