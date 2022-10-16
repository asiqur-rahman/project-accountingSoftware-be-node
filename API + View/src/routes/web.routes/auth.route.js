const express = require('express');
const router = express.Router();
const {auth} = require('../../middleware/auth.middleware');
const authController = require('../../controllers/web.controllers/auth.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {Role} = require('../../utils/enum.utils');
const { loginValidator,userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/login', awaitHandlerFactory(authController.login_Get));
router.post('/login', awaitHandlerFactory(authController.login_Post));
router.get('/whoami', auth(), awaitHandlerFactory(authController.whoAmI));
router.post('/registration', userCreateValidator, awaitHandlerFactory(authController.registration));
router.get('/logout', awaitHandlerFactory(authController.logout));

module.exports = router;