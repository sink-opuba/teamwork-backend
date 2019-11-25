const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/index');

exports.createUser = async (req, res, next) => {
  // check if email already in database
  const {
    firstName,
    lastName,
    email,
    gender,
    password,
    jobRole,
    department,
    address,
    isAdmin
  } = req.body;

  if (!email || !firstName || !lastName || password.length < 4) {
    return res.status(400).json({
      status: 'error',
      error: 'Invalid request body'
    });
  }
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [
    email
  ]);

  if (rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      error: 'Email already in use'
    });
  }
  const queryString = `INSERT INTO users(userId, first_name, last_name,email,gender,password,job_role,department,address,isAdmin,date_created) 
    VALUES(uuid_generate_v4(),$1, $2, $3, $4, $5, $6, $7, $8, $9, NOW());`;

  // encrypt password
  bcrypt.hash(password, 10).then(async hash => {
    const values = [
      firstName,
      lastName,
      email,
      gender,
      hash,
      jobRole,
      department,
      address,
      isAdmin
    ];

    // Insert payload into database
    try {
      await db.query(queryString, values);
      return res.status(201).json({
        status: 'success',
        data: {
          message: 'user account successfully created'
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        error: 'A postgresql query error'
      });
    }
  });
};

exports.signin = async (req, res, next) => {
  try {
    req.body.email = req.body.email || req.body.username;
    if (!req.body.email || !req.body.password) {
      throw 'Invalid request body';
    }

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [
      req.body.email
    ]);

    // if no email in database
    if (!rows[0]) {
      throw 'User not found';
    }
    try {
      const { userid, email, password } = rows[0];
      const match = await bcrypt.compare(req.body.password, password);
      if (!match) {
        return res.status(401).json({
          status: 'error',
          error: 'Invalid password'
        });
      }
      // if all goes well -- create a jsonwebtoken
      const token = jwt.sign(
        { userId: userid, email },
        'I AM STILL Thinking of a token secret, wait for it! ..lol',
        {
          expiresIn: '24h'
        }
      );

      // update last_login
      db.query(`UPDATE users SET last_login = NOW() where userId = $1`, [
        userid
      ]);

      return res.status(200).json({
        status: 'success',
        data: {
          userId: userid,
          token
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        error: 'An error occurred in the server!'
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      error: err
    });
  }
};
