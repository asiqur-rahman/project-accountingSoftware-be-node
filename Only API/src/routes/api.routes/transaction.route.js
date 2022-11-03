const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const transactionController = require('../../controllers/api.controllers/transaction.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/id/:id', awaitHandlerFactory(transactionController.getById));
router.post('/', awaitHandlerFactory(transactionController.create));
router.patch('/id/:id', awaitHandlerFactory(transactionController.patch));
router.delete('/id/:id', awaitHandlerFactory(transactionController.delete));
router.get('/list', awaitHandlerFactory(transactionController.list));
router.get('/ss_list', awaitHandlerFactory(transactionController.list));
router.get('/ltfd', awaitHandlerFactory(transactionController.lastTransactionsForDashboard));

module.exports = router;