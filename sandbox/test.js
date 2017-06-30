const _ = require('lodash');
const vfs = require('vinyl-fs');
const map = require('map-stream');
const stream = require('stream');
const pump     = require( 'pump' );


pump([

  vfs.src( '/Users/mgrill/Documents/**/*', { read: false }),

  new stream.Transform({
    objectMode: true,
    highWaterMark: 1,
    write(chunk, encoding, next){
      'use strict';
      console.log('Transform write:', chunk.path);
      //_.delay(next, 100);
      this.push(chunk);
      _.delay(next, 1);
    },
    final(cb){
      console.log('Transform final');
      cb();
    }
  }),

  new stream.Writable({
    objectMode: true,
    write(chunk, encoding, next) {
      console.log('SQLiteWriter->write] chunk', chunk);
      next();
    }
  })

], function(){
  'use strict';
  console.log('done', arguments);
});