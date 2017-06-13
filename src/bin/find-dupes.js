// TODO: Add exclude regexp

// Imports
const _ = require('lodash');
const fs = require('fs-extra');
const klaw = require('klaw');
const Q = require('q');
const readline = require('readline');
const sqlite = require('sqlite');
const util = require('util');

// Parse arguments
const argv = require('minimist')(process.argv.slice(2));

// Stats
let _startTime;
let _stopTime;

// SQL DB
let db = null;

/**
 * Display help
 */
function printHelp(){
  console.log('Find duplicate files in path' +
    '' +
    'Options:' +
    ' -h --help     Display this message.' +
    ' -p --path     {dir} Path to search' +
    ' -d --db       {file} Database file' +
    ' -v --verbose  Verbose output ( large performance impact )');
}

/**
 * Get scan path from argv
 * @return {*}
 */
function getScanPath(){
  return _.get(argv, 'p', false);
}

/**
 * Get the file path for persistent storage
 * @return {*}
 */
function getDbPath(){
  return _.get(argv, 'd', ':memory');
}

/**
 * True if verbose flag was set
 * @return {*}
 */
function isVerbose(){
  return _.get(argv, 'v', false);
}

/**
 * Shpw help only command line flag test
 * @return {*}
 */
function isHelp(){
  return _.get( argv, 'h', false );
}

/**
 * Start scan timer - passThrough is for promise chain
 * @param passThrough
 * @return {*}
 */
function startTimer(passThrough){
  _startTime = process.hrtime();
  if(isVerbose()){
    console.log('Scan timer started @ ' + _startTime);
  }
  return passThrough;
}

/**
 * Stop the scan timer - passThrough is for promise chain
 * @param passThrough
 * @return {*}
 */
function stopTimer(passThrough){
  _stopTime = process.hrtime(_startTime);
  if(isVerbose()){
    console.log( 'Scan timer stopped @ ' + _stopTime );
  }
  return passThrough;
}

/**
 * Prepare the SQLite DB and save the connection
 */
function initDb(){
  return sqlite.open(getDbPath(), { cached: true })
    .then(function(dbInstance){
      db = dbInstance;
      return db.migrate({ force: 'last' });
    });
}

/**
 * Close the DB Pointer
 * @param passThrough
 */
function closeDb(passThrough){
  return db.close().then(function(){
    return passThrough;
  });
}

function writeScanProgress(currentPath) {
  if(!isVerbose()){ return; }
  process.stdout.write(`Processing: ${currentPath}`);
}

function clearScanProgress(){
  if(!isVerbose()){ return; }
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}

/**
 * Process an incoming item from scan with progress
 * @param {KlawScanItem} scanResult
 */
function processFileVerbose(scanResult){
  clearScanProgress();
  writeScanProgress(scanResult.path);
  return processFile(scanResult);
}

/**
 *  Process an incoming item from scan silently
 * @param scanResult
 */
function processFile(scanResult){
  db.run("INSERT INTO files VALUES (?, ?, ?, ?)", null, scanResult.path, scanResult.stats.size, null);
}

/**
 * Run a file scan for the provided path
 */
function doScan(){
  let q = Q.defer(),
      scanCount = 0;

  // New Line for scan progress
  console.log( "Beginning Scan" );

  klaw(getScanPath())
    .on('readable', function () {
      try {
        let item;
        if(isVerbose()){
          while( (item = this.read()) ){
            processFileVerbose( item );
            scanCount++;
          }
        } else {
          while( (item = this.read()) ){
            processFile( item );
            scanCount++;
          }
        }
      } catch( err ) {
        q.reject(err);
      }
    })
    .on('end', function () {
      clearScanProgress();
      q.resolve(scanCount);
    });

  return q.promise;
}

function calcHashes(){

  // New Line for scan progress
  console.log("Beginning Hashing");

  return db.all('SELECT size, count(size) FROM files GROUP BY size HAVING size > 0 AND count(size) > 1 ORDER BY count(size) DESC')
    .then( results => {
      console.log(results);
      return results && results.length || 0;
    });
}


// Init Application


// If help, display and exit.
if( isHelp() ){
  printHelp();
  process.exit(0);
  return;
}

// make sure path is given
if( !getScanPath() ){
  console.error("-p {dir} option is required.");
  printHelp();
  process.exit(1);
  return;
}

// Start a promise to get the path and a
fs.pathExists(getScanPath())
  // Ensure path exists
  .then(function(exists){ if(!exists){ throw "Path does not exist." } })
  // Begin scan
  .then(startTimer)
  .then(initDb)
  .then(doScan)
  .then(stopTimer)
  .then(itemsProcessedCount => {
    console.log( 'Scan complete. ');
    console.log( 'Items processed: %s', itemsProcessedCount);
    console.log( 'Runtime: %d.%d Seconds.', _stopTime[0], _stopTime[1]);
  })
  .then(startTimer)
  .then(calcHashes)
  .then(stopTimer)
  .then(itemsProcessedCount => {
    console.log( 'Hashing complete. ');
    console.log( 'Items processed: %s', itemsProcessedCount);
    console.log( 'Runtime: %d.%d Seconds.', _stopTime[0], _stopTime[1]);
  })
  .then(closeDb)
  // Error handler
  .catch(function(err){
    console.error(err + ' Exiting.');
    process.exit(2);
  });