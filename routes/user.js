const userCtrl = require('../controllers/user');
const Router = require('express-promise-router');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.post('/create-user', userCtrl.createUser);

module.exports = router;
