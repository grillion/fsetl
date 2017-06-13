const { Writable } = require('stream');

class SQLiteWritable extends Writable {

  constructor(options){
    super(options);
  }

  write(chunk, encoding, callback) {
    callback();
  }

}

module.exports = SQLiteWritable;