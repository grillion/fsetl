const sqlite = require( 'sqlite' );
const BaseDb = require( './BaseDb' );
const StatsCollector = require('../util/StatsCollector');

class SQLite extends BaseDb {

  constructor(config){
    super(config);
  }

  /**
   * Prepare the SQLite DB and save the connection
   */
  open(){
    console.log('SQLite->open] File: ' + this.getConfig('path') );

    // Resolve if already open
    if( this.c() ){ return Promise.resolve(this); }

    let self = this;
    return sqlite.open(this.getConfig('path'), { cached: true })
      .then(this.setConnection.bind(this))
      // ENABLE FOR TROUBLESHOOTING
      //.then(db => {
      //  db.driver.on( 'trace', function( a ){ console.log( 'trace', a ); } );
      //  return db;
      //})
      .then(db => { return db.migrate(); })
      .then(() => { return self; });
  }


  /**
   * Close the DB Pointer
   * @param passThrough
   */
  close(passThrough){
    return this.c().close()
      .then(function(){ return passThrough; })
      .catch(function(err){
        console.log('Error closing db:', err);
      });
  }

  /**
   * See if a file exists in the DB.
   *
   * If not, add it. If the file exists then the timestamps will be checked for any modifications.
   * @param file
   */
  indexFile(file){
    let self = this;

    return new Promise(function(resolve, reject){

      self.getFile(file.path).then( existingRecord => {

        // Check for timestamps
        if( existingRecord.modified !== file.stats.mtimeMs ){
          self.updateFile(file).then( () => {
            resolve(file);
          });
        } else {
          resolve(file);
        }

      }).catch( () => {

        // try adding
        self.addFile(file).then( () => {
          resolve(file);
        }).catch(err => {
          console.error('SQLite->indexFile] Error:', err);
          reject(err);
        });
      });

    });
  }

  addFile(file){
    let now = new Date();
    let self = this;
    return this.c().run('INSERT INTO files (path, size, modified, date_created, date_updated) VALUES ($path, $size, $modified, $added, $updated)', {
      $path: file.path,
      $size: file.stats.size,
      $modified: file.stats.mtimeMs,
      $added: now,
      $updated: now
    }).then( res => {
      StatsCollector.inc('sql_insert');
      return res;
    }).catch(() => {
      return self.updateFile(file);
    });
  }

  getFile(path){

    let sql = 'SELECT * FROM files WHERE path = $path';
    return this.c().get( sql, { $path: path } ).then( res => {
      StatsCollector.inc('sql_query');
      return res;
    }).catch( function( err ){
      console.error( 'SQLite->getFile] result error:', err );
    });
  }

  getFilesInPath(path){
    console.log( 'SQLite->getFilesInPath] Path: ' + path );

    let sql = 'SELECT * FROM files WHERE path LIKE $path';

    console.log( 'SQLite->getFilesInPath] Preparing SQL statement: ' + sql );

    return this.c().prepare( sql, {
      $path: path + '%'
    }).then( sqlStmt => {
      console.log( 'SQLite->getFilesInPath] Running SQL statement: ' + sqlStmt );
      StatsCollector.inc( 'sql_query' );
      return sqlStmt;
    }).catch( function( err ){
      console.log( 'sql result err', err );
    });
  }

  getMimeTypesRequired(path){
    console.log( 'SQLite->getMimeTypesRequired] Path: ' + path );

    let sql = 'SELECT * FROM files WHERE size > 0 AND mime_type is NULL AND path LIKE $path';

    console.log( 'SQLite->getMimeTypesRequired] Preparing SQL statement: ' + sql );

    return this.c().prepare( sql, {
      $path: path + '%'
    }).then( sqlStmt => {
      console.log( 'SQLite->getMimeTypesRequired] Running SQL statement: ' + sqlStmt );
      StatsCollector.inc( 'sql_query' );
      return sqlStmt;
    }).catch( function( err ){
      console.log( 'sql result err', err );
    });
  }

  updateFile(file){
    return this.c().run('UPDATE files SET size = $size, md5 = null, md5_date = null, modified = $modified, date_updated = $updated WHERE path = $path', {
      $size: file.stats.size,
      $modified: file.stats.mtimeMs,
      $updated: new Date(),
      $path: file.path
    }).then( res => {
      StatsCollector.inc('sql_update');
      return res;
    });
  }

  updateFileMd5(file){

    let now = new Date();
    let sql = 'UPDATE files SET md5 = $hash, md5_date = $hashtime, date_updated = $updated WHERE path = $path';

    return this.c().run(sql, {
      $hash: file.md5,
      $hashtime: now,
      $updated: now,
      $path: file.path
    }).then( res => {
      StatsCollector.inc('sql_update');
      return res;
    });
  }

  updateFileMimeType(file){
    return this.c().run('UPDATE files SET mime_type = $mime, date_updated = $updated WHERE path = $path', {
      $mime: file.mime_type,
      $updated: new Date(),
      $path: file.path
    }).then( res => {
      StatsCollector.inc('sql_update');
      return res;
    });
  }

  removeFile(path){

    let sql = 'DELETE FROM files WHERE path = $path';

    return this.c().run(sql, { $path : path}).then( res => {
      StatsCollector.inc('sql_delete');
      return res;
    });
  }

  getDupeFiles(path){

    let c = this.c();
    let sql = 'SELECT * FROM files WHERE ' +
                '(md5 is NULL OR md5_date < modified )' +
                'AND ' +
                'path LIKE $path ' +
                'AND ' +
                'size IN ( ' +
                'SELECT size FROM files WHERE path LIKE $path AND size > 0 ' +
                  'AND ( md5 is NULL OR md5_date < modified ) GROUP BY size HAVING count(size) > 1 '+
                ') ORDER BY size';

    console.log('SQLite->getDupeFiles] Preparing SQL statement: ' + sql );
    return c.prepare(sql, { $path: path + '%' }).then(sqlStmt => {
      console.log('SQLite->getDupeFiles] Running SQL statement: ' + sqlStmt);
      StatsCollector.inc('sql_query');
      return sqlStmt;
    }).catch(function(err){
      console.log( 'sql result err', err );
    });
  }

}

module.exports = function(config){
  'use strict';
  let sqlInstance = new SQLite(config);
  return sqlInstance.open();
};