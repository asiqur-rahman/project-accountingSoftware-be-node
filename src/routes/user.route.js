const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { userCreateValidator } = require('../middleware/validators/userValidator.middleware');

router.get('/:id', auth(), awaitHandlerFactory(userController.getById));
router.post('/', auth(),userCreateValidator, awaitHandlerFactory(userController.create));
router.patch('/:id', auth(), awaitHandlerFactory(userController.update));
router.delete('/:id', auth(), awaitHandlerFactory(userController.delete));

module.exports = router;