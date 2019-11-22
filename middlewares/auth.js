const jwt = require('jsonwebtoken');
const db = require('../db/index');

exports.checkIfAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw 'You need an authentication token to access this resource.';
    }
    [, token] = token.split(' ');
    const decodedToken = jwt.verify(
      token,
      'I AM STILL Thinking of a token secret, wait for it! ..lol'
    );
    const { userId, email } = decodedToken;
    const result = await db.query(
      `SELECT isAdmin from users where userId = $1 AND email = $2`,
      [userId, email]
    );

    if (!result.rows[0].isadmin) {
      throw 'Invalid Request! Your need admin privileges to make this request.';
    }
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      error
    });
  }
};

exports.checkIfUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw 'You need an authentication token to access this resource.';
    }
    [, token] = token.split(' ');
    const decodedToken = jwt.verify(
      token,
      'I AM STILL Thinking of a token secret, wait for it! ..lol'
    );
    const { userId, email } = decodedToken;
    const result = await db.query(
      `SELECT * from users where userId = $1 AND email = $2`,
      [userId, email]
    );

    if (!result.rows[0]) {
      throw 'Invalid Request! Your need to signup inorder to make this request.';
    }
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      error
    });
  }
};
