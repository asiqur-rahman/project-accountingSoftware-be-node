const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const accountController = require('../../controllers/api.controllers/account.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { accountCreateValidator } = require('../../middleware/validators/accountingHeadValidator.middleware');

router.get('/id/:id',  awaitHandlerFactory(accountController.getById));
router.post('/', accountCreateValidator, awaitHandlerFactory(accountController.create));
router.patch('/id/:id',  awaitHandlerFactory(accountController.update));
router.delete('/id/:id',  awaitHandlerFactory(accountController.delete));
router.get('/list', awaitHandlerFactory(accountController.list));
router.get('/allDD', awaitHandlerFactory(accountController.chartOfAccountDD));
router.get('/currency/dropdown', awaitHandlerFactory(accountController.currencyDD));
router.get('/byParentId/:id', awaitHandlerFactory(accountController.byParentId));
router.get('/byBaseCode/:code', awaitHandlerFactory(accountController.byBaseCode));


module.exports = router;