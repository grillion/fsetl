#!/usr/bin/env node
const LaunchSettings = require('./lib/util/LaunchSettings');
const StatsCollector = require('./lib/util/StatsCollector');

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
let commandInstance = new CommandClass(function( err, stats ){
  if( err ){
    console.error( 'Error: ', err );
    process.exit(1);
  } else {
    console.log('Process complete.');
    console.log('Runtime: ', stats.timer.toString() );
    console.log('Files Scanned:', StatsCollector.get('file_scan'));
    console.log('Directories Skipped:', StatsCollector.get('dir_skip'));
    console.log('Symlinks Skipped:', StatsCollector.get('sym_skip'));
    console.log('Symlinks Skip other:', StatsCollector.get('sym_skip_other'));
    console.log('----SQLite Stats----');
    console.log('SQL Queries:', StatsCollector.get('sql_query'));
    console.log('SQL Inserts:', StatsCollector.get('sql_insert'));
    console.log('SQL Reads:  ', StatsCollector.get('sql_read'));
    console.log('SQL Updates:', StatsCollector.get('sql_update'));
    console.log('SQL Deletes:', StatsCollector.get('sql_delete'));

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