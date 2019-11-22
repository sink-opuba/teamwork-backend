CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
VALUES('c308f87e-f84d-4479-80ce-e68b6b771ef3','tring','tri','tr@test.com', 'female', '$2b$10$83w1Llw53tV8M9I8SbRAqO5EfGAUePu/t3LGU6QnkR36XLW9Jg7D2','Engineer','marketing','10, Warri str', true, NOW());

INSERT INTO users(userId, first_name, last_name,email,gender,password,job_role,department,address,isAdmin,date_created) 
VALUES('092e6fed-92b5-4dca-9d8a-66202521d951','sink','opuba','num@num.com', 'male', '$2b$10$4lPFwWA4sYzHxBBjRTNX4umBDZ0McmIP4yEWDoDkssJE7hhFPsazK','Developer','Engineering','Sokoh estate Rd', true, NOW());

INSERT INTO users(userId, first_name, last_name,email,gender,password,job_role,department,address,isAdmin,date_created) 
VALUES(uuid_generate_v4(),'test','opuba','test@test.com', 'male', '1234','Developer','Engineering','Sokoh estate Rd', false, NOW());

CREATE TABLE IF NOT EXISTS articles (
  articleId SERIAL PRIMARY KEY,
  title VARCHAR(150),
  article VARCHAR(255),
  authorId UUID REFERENCES users(userId) ON DELETE CASCADE,
  createdOn DATE,
  updatedOn DATE
);

INSERT INTO articles(articleId, title, article,authorId,createdOn)
VALUES(3,'A cool title', 'content of first article', 'c308f87e-f84d-4479-80ce-e68b6b771ef3', NOW());

CREATE TABLE IF NOT EXISTS gifs (
  gifId SERIAL PRIMARY KEY,
  title VARCHAR(150),
  imageUrl VARCHAR(255),
  authorId UUID REFERENCES users(userId) ON DELETE CASCADE,
  createdOn DATE
);

INSERT INTO gifs(gifId, title, imageUrl, authorId, createdOn)
VALUES(39, 'andela challenge gif', 'https://res.cloudinary.com/sinkcloud/image/upload/v1574208410/Images/lanqktz1bsydtznu1exv.gif', 'c308f87e-f84d-4479-80ce-e68b6b771ef3', NOW());

CREATE TABLE IF NOT EXISTS comments (
  commentId SERIAL PRIMARY KEY,
  comment VARCHAR(255),
  authorId UUID REFERENCES users(userId) ON DELETE CASCADE,
  articleId INT REFERENCES articles(articleId) ON DELETE CASCADE,
  gifId INT REFERENCES gifs(gifId) ON DELETE CASCADE,
  createdOn DATE
);

INSERT INTO comments(commentId, comment, authorId, articleId, createdOn)
VALUES(1, 'my first comment', 'c308f87e-f84d-4479-80ce-e68b6b771ef3', 3, NOW());

INSERT INTO comments(commentId, comment, authorId, gifId, createdOn)
VALUES(69, 'Test gif comment', 'c308f87e-f84d-4479-80ce-e68b6b771ef3', 39, NOW());