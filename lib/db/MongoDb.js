const MongoClient = require('mongodb').MongoClient;
const BaseDb = require( './BaseDb' );

/**
 * Config options:
 *
 * connectionUrl - eg mongodb://localhost:27017/fs-scripts
 */

class MongoDb extends BaseDb {

  constructor(config){
    super(config);
  }

  /**
   * Prepare the SQLite DB and save the connection
   */
  connect(){
    return MongoClient.connect(this.getConfig('connectionUrl'))
      .then(function(dbInstance){
        // Save connection using handle as key
        this.c(dbInstance);
        return dbInstance;
      }.bind(this));
  }


  /**
   * Close the DB Pointer
   * @param passThrough
   */
  close(passThrough){
    return this.c().close()
      .then(function(){ return passThrough; })
      .catch(function(err){
        console.log('Error closing db:', err);
      });
  }

  addFile(file){
    return this.c().collection( 'files' ).findOne({path: file.path}).then((existingDoc) => {
      if( !existingDoc ){
        return this.c().collection( 'files' ).insertOne( {
          path: file.path,
          size: file.stats.size
        }).then((iResult) => {
          if( iResult.insertedCount < 1 ){
            throw 'Cannot insert';
          }
          // count this insert
          this.statIncrement('insert', iResult.insertedCount);
        });
      } else {
        return this.c().collection( 'files' ).updateOne({ _id: existingDoc._id },{
          path: file.path,
          size: file.stats.size
        }).then((uResult) => {
          if( uResult.modifiedCount < 1 ){
            throw 'Cannot update';
          }
          this.statIncrement('update', uResult.modifiedCount );
        });
      }
    });
  }
}

module.exports = MongoDb;