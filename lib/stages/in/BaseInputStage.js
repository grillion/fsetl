const BaseStage = require( '../BaseStage' );

class BaseInputStage extends BaseStage {

  constructor(config){
    super(config);
  }

  getReadable(){
    throw new ReferenceError('BaseInputStage->getReadable] This method should be overridden.');
  }

}

module.exports = BaseInputStage;