const express = require('express');

const router = express.Router();
const fs = require('fs');

const template = fs.readFileSync(`${__dirname}/docs_template.html`, 'utf-8');

router.get('/', (req, res, next) => {
  res.status(200).send(template);
});

module.exports = router;
