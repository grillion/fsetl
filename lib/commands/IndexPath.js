// make sure path is given
const BaseCommand    = require( './BaseCommand' );
const DisplayStage   = require( '../stages/utility/DisplayStage' );
const FindFilesStage = require( '../stages/in/FindFilesStage' );
const ElasticSearchWriter = require( '../stages/out/ElasticSearchWriter' );

const LaunchSettings = require( '../util/LaunchSettings' );


class IndexPath extends BaseCommand {

  constructor(cb){
    super(cb);
  }

  validateInput(){
    if( !LaunchSettings.getInputs() ){
      process.stdout.write('IndexPath] A minimum of one input is required.\n');
      process.exit(1);
    }

    if( !LaunchSettings.getDbString() ){
      process.stdout.write('IndexPath] Please provide a SQLite database path.\n');
      process.exit(1);
    }
    console.log('IndexPath->validateInput] Ok.');
  }

  getPipe(){
    console.log('IndexPath->getPipe] Building IndexPath pipe');
    return Promise.all([
      FindFilesStage.createReadable( {
        inputs: LaunchSettings.getInputs()
      }),
      DisplayStage.createTransform(),
      ElasticSearchWriter.createWritable({
        host: '127.0.0.1',
        port: '9200',
        user: 'elastic',
        pass: 'changeme',
        index: 'files',
        esType: 'file'
      })
    ]);
  }

}

module.exports = IndexPath;

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