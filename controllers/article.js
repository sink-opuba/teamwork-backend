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

exports.editArticle = async (req, res, next) => {
  if (!req.body.title || !req.body.article) {
    return res.status(400).json({
      status: 'error',
      error: 'Invalid request body'
    });
  }

  try {
    const result = await db.query(
      `SELECT * FROM articles where articleid = $1`,
      [req.params.articleId]
    );
    if (!result.rows[0]) {
      return res.status(404).json({
        status: 'error',
        error: 'article not found!'
      });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      'I AM STILL Thinking of a token secret, wait for it! ..lol'
    );
    const { userId } = decodedToken;
    // check if user is the creator of the article
    if (userId !== result.rows[0].authorid) {
      return res.status(401).json({
        status: 'error',
        error: 'You cannot update this resource.'
      });
    }
    // Update article in database
    const update = await db.query(
      `UPDATE articles SET title = $1, article = $2, updatedon = NOW() where articleid = $3 RETURNING *;`,
      [req.body.title, req.body.article, req.params.articleId]
    );
    const { title, article, updatedon } = update.rows[0];
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'Article successfully upadated',
        title,
        article,
        updatedOn: updatedon
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error
    });
  }
};
