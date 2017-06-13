class BaseCommand{

  run(){
    throw new ReferenceError('BaseCommand should be extended and not used directly.');
  }

}

module.exports = BaseCommand;