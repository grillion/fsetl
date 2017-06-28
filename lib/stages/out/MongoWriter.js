const _ = require('lodash');
const BaseOutputStage = require('./BaseOutputStage');
const stream = require('stream');
const MongoDb = require('../../db/MongoDb');

class MongoWriter extends BaseOutputStage {

  constructor(config){
    super(config);
  }

  getStream(){

    let config = this.getConfig();
    let mongoClient = new MongoDb(config);

    console.log('MongoWriter->getWritable] Connecting to mongo', config);

    return mongoClient.connect().then(() => {

      console.log('MongoWriter->getWritable] Mongo Connected');

      return new stream.Writable({
        objectMode: true,
        write(file, encoding, next) {
          mongoClient.addFile( file )
            .then(() => { next(); })
            .catch((err) =>{ next(err); });
        },
        final(cb){
          console.log('MongoWriter->final] Closing DB', mongoClient.getStats());
          mongoClient.close();
          cb();
        }
      });
    }).catch((err) => {
      console.error('MongoWriter->getWritable] Cannot connect to mongo.', err);
    });
  }

  /**
   *
   * @param config
   * @return {Stream}
   */
  static createWritable( config ){
    let _instance = new MongoWriter(config);
    return _instance.getStream();
  }

}

module.exports = MongoWriter;