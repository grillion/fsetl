const MongoClient = require('mongodb').MongoClient;
const BaseDb = require( './BaseDb' );

/**
 * Create the files collection and a index.
 * @param db
 * @return {*}
 */
function createFilesCollection(db){
  'use strict';
  db.createCollection('files').then(() => {
    return db.ensureIndex('files', 'path', {
      unique: true,
      background:true
    });
  });
  return db;
}

/**
 * Create collections needed
 * @param {MongoDb} db  instance
 * @return {Promise.<MongoDb>}
 */
function createCollections(db){
  'use strict';
  // Prepare all collections and pass on the DB instance
  return Promise.all([
    createFilesCollection(db.c())
    // room for more here
  ]).then(() => { return db; });
}

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
        return this;
      }.bind(this))
      .then(createCollections);
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

    if( file.stats.isDirectory()){
      return Promise.resolve(true);
    }

    let now = new Date();
    //return this.c().collection( 'files' ).findOne({path: file.path}).then((existingDoc) => {
    //  if( !existingDoc ){
    return this.c().collection( 'files' ).insertOne( {
      path: file.path,
      size: file.stats.size,
      added: now,
      updated: now
    })
    .then((iResult) => {
      if( iResult.insertedCount < 1 ){
        throw 'Cannot insert';
      }
      // count this insert
      this.statIncrement('insert', iResult.insertedCount);
    })
    .catch((err) => {
      return this.c().collection( 'files' ).updateOne({ path: file.path }, {
        path: file.path,
        size: file.stats.size,
        updated: now
      }).then((uResult) => {
        if( uResult.modifiedCount < 1 ){
          throw 'Cannot update';
        }
        this.statIncrement('update', uResult.modifiedCount );
      });
    });

      //} else {
      //  return this.c().collection( 'files' ).updateOne({ _id: existingDoc._id },{
      //    path: file.path,
      //    size: file.stats.size,
      //    updated: now
      //  }).then((uResult) => {
      //    if( uResult.modifiedCount < 1 ){
      //      throw 'Cannot update';
      //    }
      //    this.statIncrement('update', uResult.modifiedCount );
      //  });
      //}
    //});
  }

  getDupeFiles(){
    let conn = this.c();
    return conn.collection('files').aggregate([
      {
        '$group': {
          '_id': '$size',
          'count': {'$sum': 1},
          'dupes': {'$push': {'_id': '$_id', 'path': '$path'}}
        }
      },
      {
        '$match': {'count': {'$gt': 1}}
      }
    ]);
  }

}

module.exports = MongoDb;