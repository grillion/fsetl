const LaunchSettings = require( './LaunchSettings' );

class HDTimer {

  start(){
    this._startTime = process.hrtime();
  }

  stop(){
    this._stopTime = process.hrtime( this._startTime );
  }

  /**
   * Start scan timer - passThrough is for promise chain
   * @param passThrough
   * @return {*}
   */
  startPassthrough(passThrough){
    this.start();
    if(LaunchSettings.isVerbose()){
      process.stdout( 'timer started @ ' + this._startTime + '\n' );
    }
    return passThrough;
  }

  /**
   * Stop the scan timer - passThrough is for promise chain
   * @param passThrough
   * @return {*}
   */
  stopTimer(passThrough){
    this.stop();
    if(LaunchSettings.isVerbose()){
      process.stdout( 'timer stopped @ ' + this._stopTime + '\n' );
    }
    return passThrough;
  }

  toString(){
    return `${this._stopTime[0]}.${this._stopTime[1]}`;
  }

}

module.exports = HDTimer;