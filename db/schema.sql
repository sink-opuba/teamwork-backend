CREATE TABLE IF NOT EXISTS users (
  userId UUID PRIMARY KEY,
  first_name VARCHAR(150),
  last_name VARCHAR(150),
  email VARCHAR(255) UNIQUE,
  gender VARCHAR(7),
  password VARCHAR(150),
  job_role VARCHAR(150),
  department VARCHAR(150),
  address VARCHAR(150),
  isAdmin Boolean DEFAULT false,
  date_created DATE,
  last_login DATE
);

INSERT INTO users(userId, first_name, last_name,email,gender,password,job_role,department,address,isAdmin,date_created) 
VALUES(uuid_generate_v4(),'sink','opuba','sink@sink.com', 'male', '1234','Developer','Engineering','Sokoh estate Rd', true, NOW());

INSERT INTO users(userId, first_name, last_name,email,gender,password,job_role,department,address,isAdmin,date_created) 
VALUES(uuid_generate_v4(),'test','opuba','test@test.com', 'male', '1234','Developer','Engineering','Sokoh estate Rd', false, NOW());

CREATE TABLE IF NOT EXISTS articles (
  articleId SERIAL PRIMARY KEY,
  title VARCHAR(150),
  article VARCHAR(255),
  authorId UUID REFERENCES users(userId) ON DELETE CASCADE,
  createdOn DATE
);

INSERT INTO articles(title, article,authorId,createdOn)
VALUES('first article', 'content of first article', 'b40175e2-512e-4bb3-8b99-0a1575104ad3', NOW());

CREATE TABLE IF NOT EXISTS gifs (
  gifId SERIAL PRIMARY KEY,
  title VARCHAR(150),
  imageUrl VARCHAR(255),
  authorId UUID REFERENCES users(userId) ON DELETE CASCADE,
  createdOn DATE
);

CREATE TABLE IF NOT EXISTS comments (
  commentId SERIAL PRIMARY KEY,
  comment VARCHAR(255),
  authorId UUID REFERENCES users(userId) ON DELETE CASCADE,
  articleId INT REFERENCES articles(articleId) ON DELETE CASCADE,
  gifId INT REFERENCES gifs(gifId) ON DELETE CASCADE,
  createdOn DATE
);