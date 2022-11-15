const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const bankAccountController = require('../../controllers/api.controllers/bankAccount.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { createValidator } = require('../../middleware/validators/bankingAccountValidator.middleware');

router.get('/id/:id',  awaitHandlerFactory(bankAccountController.getById));
router.post('/', createValidator, awaitHandlerFactory(bankAccountController.create));
router.patch('/id/:id',  awaitHandlerFactory(bankAccountController.update));
router.patch('/changeStatus/:id/:status',  awaitHandlerFactory(bankAccountController.changeStatus));
router.delete('/id/:id',  awaitHandlerFactory(bankAccountController.delete));
router.get('/list', awaitHandlerFactory(bankAccountController.list));
router.get('/dropdown', awaitHandlerFactory(bankAccountController.dropdown));


module.exports = router;