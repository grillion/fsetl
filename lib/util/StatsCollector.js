const _ = require( 'lodash' );
const HDTimer = require( '../util/HDTimer' );

/**
 * Numeric statics in key value pairs
 * @type {Object.<String, Number>}
 */
let stats = {};

/**
 * Named HDTimer instanced
 * @type {Object.<String, HDTimer>}
 */
let timers = {};

class StatsCollector {

  /**
   * Increment a counter
   * @param stat
   * @param inc
   */
  static inc(stat, inc = 1){
    stats[stat] = (stats[stat] || 0) + inc;
  }

  /**
   * Get a stat by key or all if no key provided
   * @param stat
   * @param def
   * @return {*}
   */
  static get(stat, def = 0){
    if(!stats.hasOwnProperty(stat)){
      return def;
    }
    return stat ? stats[stat] : stats;
  }

  /**
   * Start a named HDTimer instance
   * @param name
   */
  static startTimer(name){
    if( !timers.hasOwnProperty(name) ){
      timers[name] = new HDTimer();
    }
    timers[name].start();
  }

  /**
   * Stop a named HDTimer instance or ALL timers if '*' is provided
   * @param name
   */
  static stopTimer(name){
    let self = this;

    if(name === '*'){
      _.each( _.keys(timers), (k) => {
        self.stopTimer(k);
      }).value();
    } else if( timers.hasOwnProperty(name) ) {
      timers[name].stop();
    }
  }

  /**
   *
   * @param name
   * @return {HDTimer|null}
   */
  static getTimer(name){
    return timers.hasOwnProperty(name) ? timers[name] : null;
  }

}

module.exports = StatsCollector;