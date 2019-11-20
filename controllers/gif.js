const fs = require('fs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../cloudinary');
const db = require('../db/index');

exports.createGif = async (req, res, next) => {
  try {
    const uploader = async path => await cloudinary.uploads(path, 'Images');
    const { path } = req.file;
    const newPath = await uploader(path);
    // delete image from server
    fs.unlinkSync(path);

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      'I AM STILL Thinking of a token secret, wait for it! ..lol'
    );
    const { userId } = decodedToken;
    const values = [req.body.title, newPath.url, userId];
    const queryString = `INSERT INTO gifs(title, imageurl, authorid, createdon) VALUES($1, $2, $3, NOW()) RETURNING *;`;
    const result = await db.query(queryString, values);
    const { gifid, title, imageurl, createdOn } = result.rows[0];
    // if all goes well
    res.status(201).json({
      status: 'success',
      data: {
        gifId: gifid,
        message: 'Gif image successfully posted',
        createdOn,
        title,
        imageUrl: imageurl
      }
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      error
    });
  }
};

exports.deleteGif = async (req, res, next) => {
  try {
    const result = await db.query(`SELECT * FROM gifs where gifid = $1`, [
      req.params.gifId
    ]);
    if (!result.rows[0]) {
      return res.status(404).json({
        status: 'error',
        error: 'gif not found!'
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
        error: "You're not authorised to delete this resource."
      });
    }
    // Delete article from database
    await db.query(`DELETE FROM gifs where gifid = $1;`, [req.params.gifId]);
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'gif post successfully deleted'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error
    });
  }
};

exports.postGif = async (req, res, next) => {
  if (!req.body.comment) {
    return res.status(400).json({
      status: 'error',
      error: 'Invalid comment request body'
    });
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      'I AM STILL Thinking of a token secret, wait for it! ..lol'
    );
    const { userId } = decodedToken;

    // commentid | comment | authorid | articleid | gifid | createdon;
    const queryString = `INSERT INTO comments(comment, authorid, gifid, createdon) VALUES($1, $2, $3, NOW()) RETURNING *;`;
    const values = [req.body.comment, userId, req.params.gifId];
    const insertResult = await db.query(queryString, values);
    const { comment, gifid, createdon: createdOn } = insertResult.rows[0];
    const result = await db.query(`SELECT title FROM gifs where gifid = $1`, [
      gifid
    ]);
    const { title: gifTitle } = result.rows[0];
    return res.status(201).json({
      status: 'success',
      data: {
        message: 'comment successfully posted',
        createdOn,
        gifTitle,
        comment
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error
    });
  }
};
