const Configurable = require( '../util/Configurable' );

/**
 * @typedef {Object} StageConfig
 */

class BaseStage extends Configurable {

  /**
   *
   * @param {StageConfig} config
   */
  constructor(config){
    if (new.target === BaseStage) {
      throw new TypeError('Cannot construct BaseStage instances directly');
    }
    super(config);
  }

}

module.exports = BaseStage;