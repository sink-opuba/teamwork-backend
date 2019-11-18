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

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//     const userId = decodedToken.userId;
//     if (req.body.userId && req.body.userId !== userId) {
//       throw 'Invalid User ID';
//     } else {
//       next();
//     }
//   } catch (error) {
//     res.status(401).json({
//       error: new Error('Invalid request')
//     });
//   }
// };