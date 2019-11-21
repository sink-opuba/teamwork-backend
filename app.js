const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/article');
const gifRoutes = require('./routes/gif');
const feedRoutes = require('./routes/feed');
const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  // log request info to the console
  app.use(morgan('dev'));
}
// handle cors issues
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/gifs', gifRoutes);
app.use('/api/v1/feed', feedRoutes);
module.exports = app;
