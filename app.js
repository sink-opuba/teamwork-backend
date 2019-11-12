const express = require('express');
const morgan = require('morgan');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  // log request info to the console
  app.use(morgan('dev'));
}
app.use(express.json());

module.exports = app;
