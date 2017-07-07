const _ = require('lodash');
const BaseOutputStage = require('./BaseOutputStage');
const stream = require('stream');
const elasticsearch = require('elasticsearch');

class ElasticSearchWriter extends BaseOutputStage {

  constructor(config){
    super(config);

    this.client = new elasticsearch.Client({
      host: config.host + ':' + config.port,
      httpAuth: config.user + ':' + config.pass,
      log: 'error'
    });

  }

  getStream(){

    let config = this.getConfig();
    let client = this.client;

    return Promise.resolve()
      .then(() => {
        console.log('ElasticSearchWriter->getWritable] Checking for index:', config.index);
        return client.indices.exists({ index: config.index });
      })
      .then((isExists) => {
        console.log('ElasticSearchWriter->getWritable] Index response:', isExists);
        return isExists ?
          client.indices.get({ index: config.index }) :
          client.indices.create({ index: config.index });
      })
      .then((indexDef) => {
        console.log('ElasticSearchWriter->getWritable] Building writer for index:', indexDef);
        return new stream.Writable({
          objectMode: true,
          write(file, encoding, next) {
            //console.log('SQLiteWriter->write] chunk', chunk);

            if (!file.stats.isDirectory()){
              next();
            }

            // Fields:
            // stats.size
            // path
            client.search({
              index: config.index,
              body:{
                query: {
                  match: {
                    path:file.path
                  }
                }
              }
            })
            .then((searchResponse) => {

              return searchResponse.hits.total !== 0 ? true :
                client.index( {
                  index: config.index,
                  type:  config.esType,
                  body:  {
                    size:      file.stats.size,
                    path:      file.path,
                    timestamp: new Date()
                  }
                });
            }).then(function(){
              next();
            }).catch(function(err){
              next(err);
            });

          },
          final(cb){
            client.indices.refresh({
              index: config.index
            });
            console.log('ElasticSearchWriter->final]');
            cb();
          }
        });

      });
  }

}

module.exports = function( config ){
  let _instance = new ElasticSearchWriter(config);
  return _instance.getStream();
};