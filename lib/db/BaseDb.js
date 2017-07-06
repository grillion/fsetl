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

    this._stats = {
      insert: 0,
      delete: 0,
      update: 0
    };

  }

  /**
   * Manual override for connection sharing
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

  getConnection(){
    return connectionPool[this._handle];
  }

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

  statIncrement( statType, increment ){
    this._stats[statType] += increment || 1;
  }

  getStats(){
    return this._stats;
  }


  // Overload these

  //accepts 'file'
  addFile(){
    throw 'this method should be overridden';
  }

  getDupes(){
  }
}



module.exports = BaseDb;