const Router = require('express-promise-router');
const auth = require('../middlewares/auth');
const articleCtrl = require('../controllers/article');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.post('/', auth.checkIfUser, articleCtrl.createArticle);
router.patch('/:articleId', auth.checkIfUser, articleCtrl.editArticle);
router.delete('/:articleId', auth.checkIfUser, articleCtrl.deleteArticle);
router.post('/:articleId/comment', auth.checkIfUser, articleCtrl.postComment);

module.exports = router;
