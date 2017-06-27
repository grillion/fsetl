// make sure path is given
const BaseCommand    = require( './BaseCommand' );
const DisplayStage   = require( '../stages/utility/DisplayStage' );
const FindFilesStage = require( '../stages/in/FindFilesStage' );
const SQLiteWriter   = require( '../stages/out/SQLiteWriter' );

const LaunchSettings = require( '../util/LaunchSettings' );


class FindDupes extends BaseCommand {

  constructor(cb){
    super(cb);
  }

  validateInput(){
    if( !LaunchSettings.getInputs() ){
      process.stdout.write('FindDupes] A minimum of one input is required.\n');
      process.exit(1);
    }

    if( !LaunchSettings.getDbString() ){
      process.stdout.write('FindDupes] Please provide a SQLite database path.\n');
      process.exit(1);
    }
    console.log('FindDupes->validateInput] Ok.');
  }

  getPipe(){
    console.log('FindDupes->getPipe] Building FindDupes pipe');
    return [
      FindFilesStage.createReadable({
        inputs: LaunchSettings.getInputs()
      }),
      DisplayStage.createTransform(),
      SQLiteWriter.createWritable()
    ];
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