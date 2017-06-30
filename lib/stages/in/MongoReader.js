const BaseInputStage = require('./BaseInputStage');
const stream = require('stream');
const MongoDb = require('../../db/MongoDb');

class MongoReader extends BaseInputStage {

  constructor(config){
    super(config);
  }

  getReadable(){

    let config = this.getConfig();
    if( !config.query ){
      return Promise.reject('MongoReader requires \'query\' config option');
    }

    let mongoClient = new MongoDb(config);
    return mongoClient.connect().then((mClient) =>{
      return config.query( mClient );
    })
    .then(( qResult ) => {
      return new stream.Readable({
        objectMode: true,
        read: function(chunk, encoding, next){
          console.log('chunk', chunk);
          this.push(chunk);
        }
      });
    });

  }

  /**
   *
   * @param config
   * @return {Stream}
   */
  static createReadable( config ){
    let _instance = new MongoReader(config);
    return _instance.getReadable();
  }
}

module.exports = MongoReader;