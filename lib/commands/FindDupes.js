// make sure path is given
const BaseCommand    = require( './BaseCommand' );
const DisplayStage   = require( '../stages/utility/DisplayStage' );
const FindFilesStage = require( '../stages/in/FindFilesStage' );
const SQLiteWriter = require( '../stages/out/SQLiteWriter' );
const HDTimer        = require( '../util/HDTimer' );
const LaunchSettings = require( '../util/LaunchSettings' );
const pump           = require( 'pump' );

class FindDupes extends BaseCommand {

  run(){

    const _hdTimer = new HDTimer();

    if( !LaunchSettings.getInputs() ){
      process.stdout.write('FindDupes] A minimum of one input is required.\n');
      process.exit(1);
    }

    if( !LaunchSettings.getDbString() ){
      process.stdout.write('FindDupes] Please provide a SQLite database path.\n');
      process.exit(1);
    }

    _hdTimer.start();
    return pump([
      FindFilesStage.createReadable({
        inputs: LaunchSettings.getInputs()
      }),
      DisplayStage.createTransform(),
      SQLiteWriter.createWritable()
    ]);

  }

}

module.exports = FindDupes;

//  .then(startTimer)
//  .then(initDb)
//  .then(doScan)
//  .then(stopTimer)
//  .then(itemsProcessedCount => {
//    console.log( 'Scan complete. ');
//    console.log( 'Items processed: %s', itemsProcessedCount);
//    console.log( 'Runtime: %s Seconds.', _hdTimer.toString() );
//  })
//  .then(startTimer)
//  .then(calcHashes)
//  .then(stopTimer)
//  .then(itemsProcessedCount => {
//    console.log( 'Hashing complete. ');
//    console.log( 'Items processed: %s', itemsProcessedCount);
//    console.log( 'Runtime: %s Seconds.', _hdTimer.toString() );
//  })
//  .then(closeDb)
//  // Error handler
//  .catch(function(err){
//    console.error(err + ' Exiting.');
//    process.exit(2);
//  });