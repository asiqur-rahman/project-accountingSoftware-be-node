const express = require('express');
const router = express.Router();
const authController = require('../../controllers/web.controllers/auth.controller');
const {isLogedIn,notification} = require('../../middleware/auth.middleware');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {Role} = require('../../utils/enum.utils');
const { loginValidator,userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.use('/', notification(),(req, res, next) => {
   next()
});

router.get('/login', awaitHandlerFactory(authController.login_Get));
router.post('/login', awaitHandlerFactory(authController.login_Post));
router.post('/registration', userCreateValidator, awaitHandlerFactory(authController.registration));
router.get('/logout', awaitHandlerFactory(authController.logout));

module.exports = router;