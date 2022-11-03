const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const bankAccountController = require('../../controllers/api.controllers/bankAccount.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { accountCreateValidator } = require('../../middleware/validators/accountingHeadValidator.middleware');

router.get('/id/:id',  awaitHandlerFactory(bankAccountController.getById));
router.post('/', accountCreateValidator, awaitHandlerFactory(bankAccountController.create));
router.patch('/id/:id',  awaitHandlerFactory(bankAccountController.update));
router.delete('/id/:id',  awaitHandlerFactory(bankAccountController.delete));
router.get('/list', awaitHandlerFactory(bankAccountController.list));
router.get('/byParentId/:id', awaitHandlerFactory(bankAccountController.byParentId));
router.get('/byBaseCode/:code', awaitHandlerFactory(bankAccountController.byBaseCode));


module.exports = router;