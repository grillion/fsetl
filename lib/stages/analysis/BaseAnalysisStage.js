const BaseStage = require( '../BaseStage' );

class BaseAnalysisStage extends BaseStage {

  constructor(config){
    super(config);
  }

  getTransform(){
    throw new ReferenceError('BaseAnalysisStage->getTransform] This method should be overridden.');
  }

}

module.exports = BaseAnalysisStage;