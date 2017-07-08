const BaseOutputStage = require('./BaseOutputStage');
const stream = require('stream');

class SQLiteWriter extends BaseOutputStage {

  constructor(config){
    super(config);
  }

  getStream(){

    let processor = this.getConfig('processor');

    return new stream.Writable({
      objectMode: true,
      highWaterMark: 1,
      write(file, encoding, next) {
        processor(file)
          .then(function(){ return next(); })
          .catch(function(err){ next(err); });
      }
    });
  }

}

module.exports = function( config ){
  let _instance = new SQLiteWriter(config);
  return _instance.getStream();
};