let stats = {};
class StatsCollector {

  static inc(stat, inc = 1){
    stats[stat] = (stats[stat] || 0) + inc;
  }

  static get(stat, def = 0){
    if(!stats.hasOwnProperty(stat)){
      return def;
    }
    return stat ? stats[stat] : stats;
  }

}

module.exports = StatsCollector;