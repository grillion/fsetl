const _ = require('lodash');
let _argv;

class LaunchSettings {

  static setArgv(argv){
    _argv = argv;

    if( LaunchSettings.isVerbose(2) ){
      console.log( 'Verbosity is 2');
      console.log( 'Argv: ', argv);
    }
  }

  /**
   * Display help
   */
  static printHelp(){
    process.stdout.write('Find duplicate files in path\n' +
      '\n' +
      'Usage: ./index.js command [-d database] [-i input1 [-i input2 [...]]] [-o output1 [-o output2 [...]]] \n' +
      '\n' +
      'Commands:\n' +
      '    find-dupes - Scan inputs, save to db, hash needed items, print duplicate files as groups separated by extra line\n' +
      '\n' +
      'Options:\n' +
      ' -c path   JSON Config file location.\n' +
      ' -h        Display this message.\n' +
      ' -d        Database connection string if needed.\n' +
      ' -i value  Add an input.\n' +
      ' -o value  Add an output.\n' +
      ' -v [2]    Verbose output. -v 2 for more.\n');
  }

  /**
   * Shpw help only command line flag test
   * @return {*}
   */
  static isHelp(){
    return _.get( _argv, 'h', false );
  }

  /**
   * Get the command passed
   * @return {*}
   */
  static getCommand(){
    return _.get( _argv, '_[0]', null );
  }

  /**
   * Get the database connection string
   * @return {*}
   */
  static getDbString(){
    return _.get(_argv, 'd', null);
  }

  /**
   * Get inputs
   * @return {*}
   */
  static getInputs(){
    let inputs = _.get(_argv, 'i', false);
    return inputs;
  }

  /**
   * Get outputs
   * @return {*}
   */
  static getOutputs(){
    let outputs = _.get(_argv, 'i', false);
    if( _.isString(outputs) ){ outputs = [outputs]; }    // Normalize string values to an array
    return outputs;
  }

  /**
   * True if verbose flag was set
   * @param {Number} [level=1] Test for a specific level of verbosity.
   * @return {*}
   */
  static isVerbose(level){
    if( _.isNumber(level) && level > 1 ){
      return _.get(_argv, 'v', false) === level;
    }
    return _.get(_argv, 'v', false);
  }

}

module.exports = LaunchSettings;