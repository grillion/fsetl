#!/usr/bin/env node
const LaunchSettings = require('./lib/util/LaunchSettings');
const stats = require('./lib/util/StatsCollector');

// Parse arguments
LaunchSettings.setArgv(require('minimist')(process.argv.slice(2)));

// If help, display and exit.
if( LaunchSettings.isHelp() ){
  LaunchSettings.printHelp();
  process.exit(0);
}

// Was a command provided?
let commandName = LaunchSettings.getCommand();
if( !commandName ) {
  process.stdout.write('Command is missing. Use -h to see usage.\n');
  process.exit(1);
}

/**
 * Try including and running a command from the library
 * @type {BaseCommand}
 */
const CommandClass = require('./lib/commands/' + commandName);
let commandInstance = new CommandClass(function( err ){
  if( err ){
    console.error( 'Error: ', err );
    process.exit(1);
  } else {
    console.log('Process complete.');
    console.log('Runtime: ', stats.getTimer('command').toString() );
    console.log(' ');
    console.log('----Filesystem Stats----');
    console.log('Files Scanned:', stats.get('file_scan'));
    console.log('Directories Skipped:', stats.get('dir_skip'));
    console.log('Symlinks Skipped:', stats.get('sym_skip'));
    console.log('Symlinks Skip other:', stats.get('sym_skip_other'));
    console.log(' ');
    console.log('----Hashing Stats ----');
    console.log('MD5 Hashes:', stats.get('md5_count'));
    console.log('MD5 total bytes:', stats.get('md5_bytes'));
    console.log('MD5 total bytes/sec:', stats.get('md5_bytes') / stats.getTimer('command').getFloat() );
    console.log(' ');
    console.log('----SQLite Stats----');
    console.log('SQL Queries:', stats.get('sql_query'));
    console.log('SQL Inserts:', stats.get('sql_insert'));
    console.log('SQL Reads:  ', stats.get('sql_read'));
    console.log('SQL Updates:', stats.get('sql_update'));
    console.log('SQL Deletes:', stats.get('sql_delete'));

    // mongo_read
    // mongo_insert
    // mongo_update
    // mongo_delete

    // es_read
    // es_insert
    // es_update
    // es_delete

    process.exit(0);
  }
});
commandInstance.run();