const express = require('express');
const router = express.Router();
const {notification} = require('../../middleware/auth.middleware');
const portalController = require('../../controllers/web.controllers/portal.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {Role} = require('../../utils/enum.utils');
const { loginValidator,userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.use('/', notification(),(req, res, next) => {
    next()
 });

router.get('/dashboard', awaitHandlerFactory(portalController.dashboard));

router.get('/chartOfAccount', awaitHandlerFactory(portalController.chartOfAccount));
router.get('/coaByBaseCode/:code', awaitHandlerFactory(portalController.chartOfAccountByBaseCode));
router.get('/new-chartOfAccount', awaitHandlerFactory(portalController.newChartOfAccount_Get));
router.post('/new-chartOfAccount', awaitHandlerFactory(portalController.newchartOfAccount_Post));

router.get('/transaction-list', awaitHandlerFactory(portalController.transactionList));
router.get('/transaction-delete/:id', awaitHandlerFactory(portalController.transactionDelete));
router.get('/transaction-list-data', awaitHandlerFactory(portalController.transactionListData));
router.get('/new-transaction', awaitHandlerFactory(portalController.newTransaction));
router.post('/new-transaction', awaitHandlerFactory(portalController.newTransaction_Post));
router.get('/transaction-list', awaitHandlerFactory(portalController.chartOfAccount));

router.get('/logout', awaitHandlerFactory(portalController.logout));

module.exports = router;