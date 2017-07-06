-- Up
CREATE TABLE files
(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  path TEXT NOT NULL,
  size UNSIGNED BIG INT NOT NULL,
  date_created DATETIME,
  date_updated DATETIME,
  md5 VARCHAR(32)
);
CREATE UNIQUE INDEX files_id_uindex ON files (id);
CREATE UNIQUE INDEX files_path_uindex ON files (path);
CREATE INDEX md5_index ON files (md5);

-- Down
DROP TABLE files;