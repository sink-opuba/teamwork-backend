CREATE TABLE users (
  userId SERIAL PRIMARY KEY,
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

CREATE TABLE articles (
  articleId SERIAL PRIMARY KEY,
  title VARCHAR(150),
  article VARCHAR(255),
  authorId INT REFERENCES users(userId),
  createdOn DATE
);

CREATE TABLE gifs (
  gifId SERIAL PRIMARY KEY,
  title VARCHAR(150),
  imageUrl VARCHAR(255),
  authorId INT REFERENCES users(userId),
);

CREATE TABLE comments (
  commentId SERIAL PRIMARY KEY,
  comment VARCHAR(255),
  authorId INT REFERENCES users(userId),
  articleId INT REFERENCES articles(articleId),
  gifId INT REFERENCES gifs(gifId),
  createdOn DATE
);