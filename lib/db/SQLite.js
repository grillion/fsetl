const sqlite = require( 'sqlite' );
const BaseDb = require( 'BaseDb' );
let connectionPool = {};

export default class SQLiteConnection extends BaseDb {

  constructor( config ){
    super(config);
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
      });
  }


  /**
   * Close the DB Pointer
   * @param passThrough
   */
  closeDb(passThrough){
    return connectionPool[this._handle].close()
      .then(function(){ return passThrough; });
  }

}