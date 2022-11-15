const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const userController = require('../../controllers/api.controllers/user.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { userCreateValidator,userUpdateWithoutPassValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/id/:id', awaitHandlerFactory(userController.getById));
router.get('/list', awaitHandlerFactory(userController.list));
router.post('/', userCreateValidator, awaitHandlerFactory(userController.create));
router.patch('/changeStatus/:id', awaitHandlerFactory(userController.changeStatus));
router.patch('/id/:id', userUpdateWithoutPassValidator, awaitHandlerFactory(userController.update));
router.delete('/id/:id', awaitHandlerFactory(userController.delete));
router.get('/role/dropdown', awaitHandlerFactory(userController.roleDropdown));

module.exports = router;