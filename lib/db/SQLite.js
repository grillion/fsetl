const sqlite = require( 'sqlite' );
const BaseDb = require( './BaseDb' );
let connectionPool = {};

class SQLite extends BaseDb {

  constructor(){
    super();
    this._handle = Symbol();
  }

  /**
   * Prepare the SQLite DB and save the connection
   */
  open(filename){
    return sqlite.open(filename, { cached: true })
      .then(function(dbInstance){
        // Save connection using handle as key
        connectionPool[ this._handle ] = dbInstance;
        return dbInstance.migrate({ force: 'last' });
      }.bind(this));
  }


  /**
   * Close the DB Pointer
   * @param passThrough
   */
  closeDb(passThrough){
    return connectionPool[this._handle].close()
      .then(function(){ return passThrough; })
      .catch(function(err){
        console.log('Error closing db:', err);
      });
  }

  /**
   * PAss arguments through to
   */
  run(){
    return connectionPool[this._handle].run.apply(connectionPool[this._handle], arguments);
  }
}

module.exports = SQLite;