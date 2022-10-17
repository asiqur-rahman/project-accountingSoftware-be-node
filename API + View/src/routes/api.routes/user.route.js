const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const userController = require('../../controllers/api.controllers/user.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/:id', apiAuth(), awaitHandlerFactory(userController.getById));
router.post('/', apiAuth(),userCreateValidator, awaitHandlerFactory(userController.create));
router.patch('/:id', apiAuth(), awaitHandlerFactory(userController.update));
router.delete('/:id', apiAuth(), awaitHandlerFactory(userController.delete));

module.exports = router;