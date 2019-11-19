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
    const queryString = `INSERT INTO gifs(title, imageurl, authorid, createdon) VALUES($1, $2, $3, NOW());`;
    await db.query(queryString, values);
    const result = await db.query(
      `SELECT * FROM gifs where title = $1 AND imageurl = $2`,
      [req.body.title, newPath.url]
    );
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
