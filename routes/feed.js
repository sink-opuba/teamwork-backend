const Router = require('express-promise-router');
const auth = require('../middlewares/auth');
const feedCtrl = require('../controllers/feed');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/articles', auth.checkIfUser, feedCtrl.getAllArticles);
router.get('/gifs', auth.checkIfUser, feedCtrl.getAllGifs);

module.exports = router;
