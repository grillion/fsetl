const _ = require('lodash')
const sqlite = require( 'sqlite' );
const BaseDb = require( './BaseDb' );

class SQLite extends BaseDb {

  constructor(){
    super();
  }

  /**
   * Prepare the SQLite DB and save the connection
   */
  open(filename){
    console.log('SQLite->open] File: ' + filename );
    return sqlite.open(filename, { cached: true })
      .then(function(dbInstance){
        console.log('SQLite->open] Database opened successfully.' );

        //dbInstance.driver.on('trace', function(a){
        //  console.log('trace', a);
        //});

        // Save connection using handle as key
        this.setConnection(dbInstance);
        return dbInstance.migrate();
      }.bind(this))
      .then(function(){
        return this;
      }.bind(this));
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

    if( file.stats.isDirectory()){
      return Promise.resolve(true);
    }

    let now = new Date();

    return this.c().run('INSERT INTO files (path, size, date_created, date_updated) VALUES ($path, $size, $added, $updated)', {
      $path: file.path,
      $size: file.stats.size,
      $added: now,
      $updated: now
    });
  }

  getDupeFiles(){

    //return this.c().all('SELECT * FROM FILES WHERE size IN ( SELECT size FROM files WHERE size > 0 GROUP BY size ) ORDER BY size');
    let c = this.c();
    let sql = 'SELECT t.* FROM files t LIMIT 100';

    console.log('SQLite->getDupeFiles] Preparing SQL statement: ' + sql );
    return c.prepare(sql).then(sqlStmt => {
      console.log('SQLite->getDupeFiles] Running SQL statement: ' + sqlStmt);
      return sqlStmt;
    }).catch(function(err){
      console.log( 'sql result err', err );
    });

  }

}

module.exports = SQLite;