const vfs = require('vinyl-fs');
const map = require('map-stream');
const stream = require('stream');
const pump     = require( 'pump' );


pump([
  vfs.src( '/Users/mgrill/Documents/**/*', { read: false }),
  map(function(file, cb){
    console.log('DisplayStage] File:', file);
    cb(null, file);
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