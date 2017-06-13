const BaseStage = require( '../BaseStage' );

class BaseUtilityStage extends BaseStage {

  constructor(config){
    super(config);
  }

  getTransform(){
    throw new ReferenceError('BaseUtilityStage->getTransform] This method should be overridden.');
  }

}

module.exports = BaseUtilityStage;