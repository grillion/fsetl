const stats    = require( '../util/StatsCollector' );
const s_cb     = Symbol();
const miss     = require( 'mississippi');

/**
 * @typedef {Object} CommandResponse
 * @property {HDTimer} timer HDTimer instance of runtime
 */

class BaseCommand{

  constructor(cb){
    this[s_cb] = cb;
  }

  run(){
    this.validateInput();
    console.log('BaseCommand->run] Starting...');

    stats.startTimer('command');

    let self = this;

    this.getPipe().then(function(pipe){
      console.log('BaseCommand->run] Pipe prepared. Running pump.');
      return pipe;
    }).then(function(pipe){
      miss.pipe( pipe, self.runComplete.bind(self));
    })

    .catch(self.runComplete.bind(self));

  }

  runComplete(err){
    stats.stopTimer('command');
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