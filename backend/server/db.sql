-- SQL export generated from backend/server/db.json
-- Usage examples:
-- 1) Using a DATABASE_URL style URI:
--    psql "postgres://user:pass@host:5432/dbname" -f db.sql
-- 2) Using psql with connection parameters:
--    PGPASSWORD=pass psql -h host -U user -d dbname -f db.sql
-- The script will create the leaderboard table if it does not exist

BEGIN TRANSACTION;

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[leaderboard]') AND type in (N'U'))
BEGIN
CREATE TABLE dbo.leaderboard (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  sector NVARCHAR(255) NOT NULL,
  score INT NOT NULL,
  date DATETIMEOFFSET NOT NULL
);
END

-- Insert rows from db.json
INSERT INTO leaderboard (name, sector, score, date) VALUES ('fff','DETI',2,'2025-11-04T15:22:02.077Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('fff','DETI',2,'2025-11-04T16:18:34.103Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('fff','DETI',2,'2025-11-04T16:21:12.971Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('fff','DETI',10,'2025-11-04T16:27:33.445Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('JPSA','DETI',3,'2025-11-04T18:42:53.475Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('teste','teste',3,'2025-11-04T18:57:11.082Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('Claudio','Assis',2,'2025-11-04T19:02:16.410Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('gh','hdahf',2,'2025-11-10T18:28:43.207Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('JPSA','DEIRC',3,'2025-11-10T18:36:53.873Z');
INSERT INTO leaderboard (name, sector, score, date) VALUES ('Automated','Dev',42,'2025-11-20T21:17:23.259430Z');

COMMIT;

-- End of file
