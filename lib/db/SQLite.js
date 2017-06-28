const _ = require('lodash')
const sqlite = require( 'sqlite' );
const BaseDb = require( './BaseDb' );

class SQLite extends BaseDb {

  constructor(){
    super();
  }

  /**
   * Prepare the SQLite DB and save the connection
   */
  open(filename){
    return sqlite.open(filename, { cached: true })
      .then(function(dbInstance){
        // Save connection using handle as key
        this.setConnection(dbInstance);
        return dbInstance.migrate({ force: 'last' });
      }.bind(this));
  }


  /**
   * Close the DB Pointer
   * @param passThrough
   */
  closeDb(passThrough){
    return this.c().close()
      .then(function(){ return passThrough; })
      .catch(function(err){
        console.log('Error closing db:', err);
      });
  }

  /**
   * PAss arguments through to
   */
  run(){
    return this.c().run.apply(this.c(), arguments);
  }

}

module.exports = SQLite;