const express = require('express');
const router = express.Router();
const {notification} = require('../../middleware/auth.middleware');
const portalController = require('../../controllers/web.controllers/portal.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

router.get('/', awaitHandlerFactory(portalController.portal));
router.get('/dashboard', awaitHandlerFactory(portalController.dashboard));
router.get('/dashboardLTFD', awaitHandlerFactory(portalController.dashboardLTFD));
router.get('/dashboardEAR', awaitHandlerFactory(portalController.dashboardEAR));
router.get('/dashboardApex/:days', awaitHandlerFactory(portalController.dashboardApex));

router.get(['/new-user','/new-user/:id'], awaitHandlerFactory(portalController.newUser));
router.post(['/new-user','/new-user/:id'], awaitHandlerFactory(portalController.newUser_Post));
router.post(['/new-user','/new-user/:id'], awaitHandlerFactory(portalController.newUser_Post));
router.get('/user-list', awaitHandlerFactory(portalController.userList));
router.get('/username-check/:name', awaitHandlerFactory(portalController.usernameCheck));
router.get('/user-change-status/:id', awaitHandlerFactory(portalController.userChangeStatus));
router.get('/user-password-reset/:id', awaitHandlerFactory(portalController.userResetPassword));
router.get('/user/:id', awaitHandlerFactory(portalController.getUserById));
router.get('/user-list-data', awaitHandlerFactory(portalController.userListData));

router.get('/chartOfAccount', awaitHandlerFactory(portalController.chartOfAccount));
router.get('/coaByBaseCode/:code', awaitHandlerFactory(portalController.chartOfAccountByBaseCode));
router.get(['/new-chartOfAccount','/new-chartOfAccount/:id'], awaitHandlerFactory(portalController.newChartOfAccount_Get));
router.post(['/new-chartOfAccount','/new-chartOfAccount/:id'], awaitHandlerFactory(portalController.newchartOfAccount_Post));

router.get(['/bank-account','/bank-account/:id'], awaitHandlerFactory(portalController.bankAccount));
router.post(['/bank-account','/bank-account/:id'], awaitHandlerFactory(portalController.bankAccount_Post));
router.get('/bank-account-list', awaitHandlerFactory(portalController.bankAccountList));
router.get('/bank-account-list-data', awaitHandlerFactory(portalController.bankAccountListData));

router.get(['/cheque-record','/cheque-record/:id'], awaitHandlerFactory(portalController.chequeRecord));
router.post(['/cheque-record','/cheque-record/:id'], awaitHandlerFactory(portalController.chequeRecord_Post));
router.delete(['/cheque-delete/:id'], awaitHandlerFactory(portalController.chequeDelete));
router.get('/cheque-record-list', awaitHandlerFactory(portalController.chequeRecordList));
router.get('/cheque-record-list-data', awaitHandlerFactory(portalController.chequeRecordListData));

router.get('/transaction-list', awaitHandlerFactory(portalController.transactionList));
router.get('/transaction-details/:id', awaitHandlerFactory(portalController.transactionDetails));
router.delete('/transaction-delete/:id', awaitHandlerFactory(portalController.transactionDelete));
router.get('/transaction-list-data', awaitHandlerFactory(portalController.transactionListData));
router.get('/new-transaction', awaitHandlerFactory(portalController.newTransaction));
router.post('/new-transaction', awaitHandlerFactory(portalController.newTransaction_Post));
router.get('/transaction-list', awaitHandlerFactory(portalController.chartOfAccount));

router.get('/income-statement', awaitHandlerFactory(portalController.chartOfAccount));

router.get('/logout', awaitHandlerFactory(portalController.logout));

module.exports = router;