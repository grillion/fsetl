-- Up
CREATE TABLE files
(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  path TEXT NOT NULL,
  size UNSIGNED BIG INT NOT NULL,
  mime_type VARCHAR(128),
  md5 VARCHAR(32),
  md5_date BIGINT,
  video_width INTEGER,
  video_height INTEGER,
  image_width INTEGER,
  image_height INTEGER,
  modified BIGINT NOT NULL,
  date_created BIGINT NOT NULL,
  date_updated BIGINT NOT NULL
);
CREATE UNIQUE INDEX files_id_uindex ON files (id);
CREATE UNIQUE INDEX files_path_uindex ON files (path);
CREATE INDEX md5_index ON files (md5);
CREATE INDEX size_index ON files (size);
CREATE INDEX mime_type_index ON files (mime_type);

-- Down
DROP TABLE files;