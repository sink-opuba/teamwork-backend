const db = require('../db/index');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res, next) => {
  // TODO - check if admin, if not - respond with 401 - unauthorized
  //   --- create a middleware for that

  // check if email already in database
  const { email } = req.body;
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [
    email
  ]);

  if (rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      error: 'Email already in use'
    });
  } else {
    const queryString = `INSERT INTO users(userId, first_name, last_name,email,gender,password,job_role,department,address,isAdmin,date_created) 
    VALUES(uuid_generate_v4(),$1, $2, $3, $4, $5, $6, $7, $8, $9, NOW());`;
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
        const re = await db.query(queryString, values);
        console.log(re.rows);
        return res.status(201).json({
          status: 'success',
          data: {
            message: 'user account successfully created'
          }
        });
      } catch (err) {
        return res.status(500).json({
          status: 'error',
          error: 'An error occured in the server. We\re on it, never worry.'
        });
      }
    });
  }
};
