const sqlite = require( 'sqlite' );
const BaseDb = require( './BaseDb' );
const StatsCollector = require('../util/StatsCollector');

class SQLite extends BaseDb {

  constructor(){
    super();
    StatsCollector.def('sql_query');
    StatsCollector.def('sql_update');
    StatsCollector.def('sql_insert');
  }

  /**
   * Prepare the SQLite DB and save the connection
   */
  open(filename){
    console.log('SQLite->open] File: ' + filename );

    let self = this;

    this.setHandle( filename );
    if( this.c() ){
      console.log('SQLite->open] Reusing existing connection: ' + filename );
      return Promise.resolve(self);
    }

    return sqlite.open(filename, { cached: true })
      .then(function(dbInstance){
        console.log('SQLite->open] Database opened successfully.' );

        //dbInstance.driver.on('trace', function(a){
        //  console.log('trace', a);
        //});

        // Save connection using handle as key
        self.setConnection(dbInstance);
        return dbInstance.migrate();
      })
      .then(function(){
        return self;
      });
  }


  /**
   * Close the DB Pointer
   * @param passThrough
   */
  closeDb(passThrough){
    return this.c().close()
      .then(function(){ return passThrough; })
      .catch(function(err){
        console.log('Error closing db:', err);
      });
  }

  addFile(file){
    let now = new Date();
    let self = this;
    return this.c().run('INSERT INTO files (path, size, date_created, date_updated) VALUES ($path, $size, $added, $updated)', {
      $path: file.path,
      $size: file.stats.size,
      $added: now,
      $updated: now
    }).then( res => {
      StatsCollector.inc('sql_insert');
      return res;
    }).catch(() => {
      return self.updateFile(file);
    });
  }

  updateFile(file){
    return this.c().run('UPDATE files SET size = $size, date_updated = $updated WHERE path = $path', {
      $size: file.stats.size,
      $updated: new Date(),
      $path: file.path
    }).then( res => {
      StatsCollector.inc('sql_update');
      return res;
    });
  }

  updateFileMd5(file){

    let now = new Date();
    let sql = 'UPDATE files SET md5 = $hash, date_updated = $updated WHERE path = $path';

    return this.c().prepare(sql, {
      $hash: file.md5,
      $updated: now,
      $path: file.path
    }).then(sqlStmt =>{
      return sqlStmt.run();
    }).then( res => {
      StatsCollector.inc('sql_update');
      return res;
    });
  }

  getDupeFiles(){

    let c = this.c();
    let sql = 'SELECT * FROM FILES WHERE size IN ( SELECT size FROM files WHERE size > 0 GROUP BY size HAVING count(size) > 1 ) ORDER BY size';

    console.log('SQLite->getDupeFiles] Preparing SQL statement: ' + sql );
    return c.prepare(sql).then(sqlStmt => {
      console.log('SQLite->getDupeFiles] Running SQL statement: ' + sqlStmt);
      StatsCollector.inc('sql_query');
      return sqlStmt;
    }).catch(function(err){
      console.log( 'sql result err', err );
    });

  }

}

module.exports = SQLite;