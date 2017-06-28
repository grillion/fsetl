const HDTimer  = require( '../util/HDTimer' );
const pump     = require( 'pump' );
const s_cb     = Symbol();
/**
 * @typedef {Object} CommandResponse
 * @property {HDTimer} timer HDTimer instance of runtime
 */

class BaseCommand{

  constructor(cb){
    this[s_cb] = cb;
    this._hdTimer = new HDTimer();
  }

  startTimer(){
    console.log('BaseCommand->startTimer]');
    this._hdTimer.start();
  }

  stopTimer(){
    console.log('BaseCommand->stopTimer]');
    this._hdTimer.stop();
  }

  run(){
    this.validateInput();
    console.log('BaseCommand->run] Starting...');
    this.startTimer();
    this.getPipe().then(pipe => {
      pump( pipe, this.runComplete.bind(this));
    })
  }

  runComplete(err){
    this.stopTimer();
    console.log('BaseCommand->runComplete]');
    if(this[s_cb]){
      this[s_cb](err, this.createStats());
    }
  }

  createStats(){
    console.log('BaseCommand->createStats]');
    return {
      timer: this._hdTimer
    };
  }

  /**
   * Implement these to extend
   * @return Promise
   */
  getPipe(){
    if (this instanceof BaseCommand) {
      throw new TypeError('Cannot construct BaseCommand instances directly');
    }
  }

  validateInput(){
    if (this instanceof BaseCommand) {
      throw new TypeError('Cannot construct BaseCommand instances directly');
    }
  }

}

module.exports = BaseCommand;