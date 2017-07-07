let stats = {};
class StatsCollector {

  static def(stat, defaultVal = 1){
    if(!stats.hasOwnProperty(stat)){
      stats[stat] = defaultVal;
    }
  }

  static inc(stat, inc = 1){
    stats[stat] += inc;
  }

  static get(stat, def = 0){
    if(!stats.hasOwnProperty(stat)){
      return def;
    }
    return stat ? stats[stat] : stats;
  }

}

module.exports = StatsCollector;