const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { userCreateValidator } = require('../middleware/validators/userValidator.middleware');

router.get('/:id', auth(), awaitHandlerFactory(userController.getUserById));
router.post('/', auth(),userCreateValidator, awaitHandlerFactory(userController.createUser));
router.patch('/:id', auth(), awaitHandlerFactory(userController.updateUser));
router.delete('/:id', auth(), awaitHandlerFactory(userController.deleteUser));

module.exports = router;