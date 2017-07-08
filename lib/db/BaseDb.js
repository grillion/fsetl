const _ = require('lodash');
const Configurable = require('../util/Configurable');

// connection instance storage
let connectionPool = {};

/**
 * @typedef {Object} Connection
 */
class BaseDb extends Configurable {

  constructor( config ){
    super(config);
    this._handle = Symbol();
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
    return conn;
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

  indexFile(file){
  }

  //accepts 'file'
  addFile(file){
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