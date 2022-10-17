const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const authController = require('../../controllers/api.controllers/auth.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { loginValidator,userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.post('/login', loginValidator, awaitHandlerFactory(authController.login));
router.get('/whoami', apiAuth(), awaitHandlerFactory(authController.whoAmI));
router.post('/registration', userCreateValidator, awaitHandlerFactory(authController.registration));

module.exports = router;