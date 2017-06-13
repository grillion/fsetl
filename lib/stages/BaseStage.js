const _ = require('lodash');
const s_config = Symbol();

/**
 * @typedef {Object} StageConfig
 */

class BaseStage {

  /**
   *
   * @param {StageConfig} config
   */
  constructor(config){
    if (new.target === BaseStage) {
      throw new TypeError('Cannot construct BaseStage instances directly');
    }

    this[s_config] = config;
  }

  /**
   * Get the config or value at a given json path
   * @param {String} [jsonPath=null] Optional path for specific value.
   * @param {*} [defaultValue=null] Optional default value for jsonPath key.
   * @return {*}
   */
  getConfig(jsonPath, defaultValue) {
    return (jsonPath) ? _.get( this[s_config], jsonPath, defaultValue) : this[s_config];
  }

}

module.exports = BaseStage;