const BaseStage = require( '../BaseStage' );

class BaseFilterStage extends BaseStage {

  constructor(config){
    super(config);
  }

  getTransform(){
    throw new ReferenceError('BaseFilterStage->getTransform] This method should be overridden.');
  }

}

module.exports = BaseFilterStage;