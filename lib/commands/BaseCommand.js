const _ = require('lodash');
const Configurable = require( '../util/Configurable' );
const stats        = require( '../util/StatsCollector' );
const miss         = require( 'mississippi');
const promisify    = require('util').promisify;

/**
 * @typedef {Object} CommandResponse
 * @property {HDTimer} timer HDTimer instance of runtime
 */


class BaseCommand extends Configurable {

  constructor(config){
    super(config);
  }

  /**
   * Run this command
   *
   * Async create the pipe then run the pipe.
   */
  run(){

    // Call sub-classed validator
    this.validateInput();

    console.log('BaseCommand->run] Inputs valid');
    stats.startTimer('command');

    let self = this;
    return this.getConnections()
      .then(connections => {
        let runPump = promisify(miss.pipe);
        return self.getPipe(connections)
          .then(runPump)
          .then(() => {
            return BaseCommand.closeConnections(connections);
          })
          .then(() => { stats.stopTimer('command'); });
      })
      .catch( err => {
        console.error('Run command error:', err);
      });
  }


  validateInput() {
    throw 'Override this method! - BaseCommand.validateInput';
  }

  getConnections(){
    throw 'Override this method! - BaseCommand.getConnections';
  }

  /**
   * Close all connections
   * @param connections
   */
  static closeConnections(connections){
    return Promise.all(_.map( connections, function(c){
      //return c.close();
      return true;
    }));
  }

  /**
   * Implement these to extend
   * @return Promise
   */
  getPipe(connections) {
    throw 'Override this method! - BaseCommand.getPipe';
  }

}

module.exports = BaseCommand;