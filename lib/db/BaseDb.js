const _ = require('lodash');
const s_config = Symbol();
let connectionPool = {};

/**
 * @typedef {Object} Connection
 */
class BaseDb {

  constructor( config ){
    this[s_config] = config;
    this._handle   = Symbol();
  }

  /**
   * Manual override for connection sharing, See SQLite in lib/db and any command that
   * reads AND writes to the same DB.
   *
   * @param newHandle
   */
  setHandle(newHandle){
    this._handle = newHandle;
  }

  /**
   * Get the config or value at a given json path
   * @param {String} [jsonPath=null] Optional path for specific value.
   * @param {*} [defaultValue=null] Optional default value for jsonPath key.
   * @return {*}
   */
  getConfig( jsonPath, defaultValue ){
    return (jsonPath) ? _.get( this[s_config], jsonPath, defaultValue ) : this[s_config];
  }

  /**
   * Get the internal db connection
   * @return {*}
   */
  getConnection(){
    return connectionPool[this._handle];
  }

  /**
   * Set this instance's internal connection
   * @param conn
   */
  setConnection( conn ){
    connectionPool[this._handle] = conn;
  }

  /**
   * Shorthand get / set for connection
   * @param [newVal=null] Pass newVal to SET, leave empty for GET
   * @return {Connection|null}
   */
  c( newVal ){
    if( newVal ){
      this.setConnection( newVal );
    } else {
      return this.getConnection();
    }
  }

  // Overload these

  open(){
  }

  close(){
  }

  //accepts 'file'
  addFile(){
    throw 'this method should be overridden';
  }

  /**
   * TODO This method should return a Readable stream of results
   * Result set should be full records of each file whose file size is non-unique and more than 0
   * the result set should NOT include items which have already been hashed since the last modified time
   */
  getDupeFiles(){
  }

}



module.exports = BaseDb;