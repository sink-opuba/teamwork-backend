const db = require('../db/index');

exports.getAllArticles = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT articleid AS id, createdOn, title, article, authorId FROM articles ORDER BY createdon ASC;`
    );
    if (result.rows.length < 1) {
      res.status(404).json({
        status: 'error',
        error: 'No posted articles'
      });
    }
    res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error
    });
  }
};

exports.getAllGifs = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT gifid AS id, createdOn, title, imageUrl as url, authorId FROM gifs ORDER BY createdon ASC;`
    );
    if (result.rows.length < 1) {
      res.status(404).json({
        status: 'error',
        error: 'No posted gifs'
      });
    }
    res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error
    });
  }
};
