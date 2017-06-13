#!/usr/bin/env node
const LaunchSettings = require( './lib/util/LaunchSettings.js' );

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
const CommandClass  = require('./lib/commands/' + commandName);
let commandInstance = new CommandClass();
commandInstance.run();