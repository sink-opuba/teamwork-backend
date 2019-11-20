const Router = require('express-promise-router');
const auth = require('../middlewares/auth');
const multerUpload = require('../middlewares/multer');
const gifCtrl = require('../controllers/gif');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.post('/', auth.checkIfUser, multerUpload, gifCtrl.createGif);
router.delete('/:gifId', auth.checkIfUser, gifCtrl.deleteGif);

module.exports = router;
