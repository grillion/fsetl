/**
 * Modified version of klaw to ignore stat errors and some ES5 changes
 *
 * https://github.com/jprichardson/node-klaw
 *
 * @type {ok}
 */
const path = require('path');
const Readable = require('stream').Readable;
const util = require('util');

function FSStream (dir, options) {
  let defaultStreamOptions = { objectMode: true };
  let defaultOpts = { queueMethod: 'shift', pathSorter: undefined, filter: undefined };
  options = Object.assign(defaultOpts, options, defaultStreamOptions);

  Readable.call(this, options);
  this.root = path.resolve(dir);
  this.paths = [this.root];
  this.options = options;
  this.fs = options.fs || require('graceful-fs');
}
util.inherits(FSStream, Readable);

FSStream.prototype._read = function () {
  if (this.paths.length === 0) return this.push(null);
  let self = this;
  let pathItem = this.paths[this.options.queueMethod]();

  self.fs.lstat(pathItem, function (err, stats) {
    let item = { path: pathItem, stats: stats };
    if (err) {
      console.log('FSStream->skipping stat error: ', pathItem);
      return true; // self.emit('error', err, item);
    }

    // Push item and exit
    if (!stats.isDirectory()) {
      return self.push(item);
    }

    // Process directory
    self.fs.readdir(pathItem, function (err, pathItems) {
      if (err) {
        self.push(item);
        return self.emit('error', err, item);
      }

      pathItems = pathItems.map( function (part) { return path.join(pathItem, part); });
      if (self.options.filter) { pathItems = pathItems.filter(self.options.filter); }
      if (self.options.pathSorter) { pathItems.sort(self.options.pathSorter); }
      pathItems.forEach( function (pi) { self.paths.push(pi); });

      self.push(item);
    });
  });
};

function walk (root, options) {
  return new FSStream(root, options);
}

module.exports = walk;