class HDTimer {

  start(){
    this._startTime = process.hrtime();
  }

  stop(){
    this._stopTime = process.hrtime( this._startTime );
  }

  getFloat(){
    return this._stopTime[0] + ( this._stopTime[1] / 100000000 );
  }

  toString(){
    return `${this._stopTime[0]}.${this._stopTime[1]} seconds`;
  }

}

module.exports = HDTimer;