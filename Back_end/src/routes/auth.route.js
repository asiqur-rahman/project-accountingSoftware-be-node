const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const {Role} = require('../utils/enum.utils');
const { loginValidator,userCreateValidator } = require('../middleware/validators/userValidator.middleware');

router.post('/login', loginValidator, awaitHandlerFactory(authController.login));
router.get('/whoami', auth(), awaitHandlerFactory(authController.whoAmI));
router.post('/registration', userCreateValidator, awaitHandlerFactory(authController.registration));

module.exports = router;