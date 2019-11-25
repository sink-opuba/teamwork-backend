const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLImit = require('express-rate-limit');
const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/article');
const gifRoutes = require('./routes/gif');
const feedRoutes = require('./routes/feed');
const getDocsRoutes = require('./api_docs/docs');

const app = express();
// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  // log request info to the console
  app.use(morgan('dev'));
}

app.use(compression());
app.use(helmet());

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

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLImit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5 // 5 requests,
  });
  app.use(limiter);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/gifs', gifRoutes);
app.use('/api/v1/feed', feedRoutes);

app.use('/', getDocsRoutes);
app.use('/docs', getDocsRoutes);
app.use('/api/v1/docs', getDocsRoutes);

module.exports = app;
