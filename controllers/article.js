const jwt = require('jsonwebtoken');
const db = require('../db/index');

exports.createArticle = async (req, res, next) => {
  if (!req.body.title || !req.body.article) {
    return res.status(400).json({
      status: 'error',
      error: 'Invalid request body'
    });
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      'I AM STILL Thinking of a token secret, wait for it! ..lol'
    );
    const { userId } = decodedToken;
    const values = [req.body.title, req.body.article, userId];

    const queryString = `INSERT INTO articles(title, article, authorid, createdon) VALUES($1, $2, $3, NOW());`;
    await db.query(queryString, values);

    const result = await db.query(
      `SELECT * FROM articles where title = $1 AND article = $2`,
      [req.body.title, req.body.article]
    );

    const { articleid, title, createdon } = result.rows[0];
    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Article successfully posted',
        articleId: articleid,
        createdOn: createdon,
        title
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error
    });
  }
};
