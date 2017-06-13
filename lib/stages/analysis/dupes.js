//function calcHashes(){
//
//  // New Line for scan progress
//  console.log("Beginning Hashing");
//
//  return db.all('SELECT size, count(size) FROM files GROUP BY size HAVING size > 0 AND count(size) > 1 ORDER BY count(size) DESC')
//    .then( results => {
//      console.log(results);
//      return results && results.length || 0;
//    });
//}