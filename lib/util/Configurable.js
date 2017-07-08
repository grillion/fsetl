const _ = require('lodash');

// random symbol used once at runtime so child classes can't use _.config
// use this.getConfig()
let s_config = Symbol();

class Configurable {

  constructor(config){
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

module.exports = Configurable;