const Router = require('express-promise-router');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.post('/create-user', auth.checkIfAdmin, userCtrl.createUser);
router.post('/signin', userCtrl.signin);

module.exports = router;
