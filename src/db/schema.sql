CREATE TABLE users (
	id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL,
	email varchar(255) NOT NULL UNIQUE,
  age integer NULL CHECK (age > 0),
  role varchar(255) NOT NULL default 'user'
);


CREATE TABLE admin (
    user_id INTEGER PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
 
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
 
CREATE INDEX "IDX_session_expire" ON "session" ("expire");