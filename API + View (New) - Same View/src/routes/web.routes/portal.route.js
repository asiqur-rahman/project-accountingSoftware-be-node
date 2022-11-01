const express = require('express');
const router = express.Router();
const {webAuth} = require('../../middleware/auth.middleware');
const portalController = require('../../controllers/web.controllers/portal.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

router.get('/', webAuth(), awaitHandlerFactory(portalController.portal));
router.get('/dashboardLTFD', awaitHandlerFactory(portalController.dashboardLTFD));
router.get('/dashboardEAR',  awaitHandlerFactory(portalController.dashboardEAR));
router.get('/dashboardApex/:days',  awaitHandlerFactory(portalController.dashboardApex));

router.get(['/new-user','/new-user/:id'], webAuth(), awaitHandlerFactory(portalController.newUser));
router.post(['/new-user','/new-user/:id'], webAuth(), awaitHandlerFactory(portalController.newUser_Post));
router.post(['/new-user','/new-user/:id'], webAuth(), awaitHandlerFactory(portalController.newUser_Post));
router.get('/user-list', webAuth(), awaitHandlerFactory(portalController.userList));
router.get('/username-check/:name', webAuth(), awaitHandlerFactory(portalController.usernameCheck));
router.get('/user-change-status/:id', webAuth(), awaitHandlerFactory(portalController.userChangeStatus));
router.get('/user-password-reset/:id', webAuth(), awaitHandlerFactory(portalController.userResetPassword));
router.get('/user/:id', webAuth(), awaitHandlerFactory(portalController.getUserById));
router.get('/user-list-data', webAuth(), awaitHandlerFactory(portalController.userListData));

router.get('/chartOfAccount', webAuth(), awaitHandlerFactory(portalController.chartOfAccount));
router.get('/coaByBaseCode/:code', webAuth(), awaitHandlerFactory(portalController.chartOfAccountByBaseCode));
router.get(['/new-chartOfAccount','/new-chartOfAccount/:id'], webAuth(), awaitHandlerFactory(portalController.newChartOfAccount_Get));
router.post(['/new-chartOfAccount','/new-chartOfAccount/:id'], webAuth(), awaitHandlerFactory(portalController.newchartOfAccount_Post));

router.get(['/bank-account','/bank-account/:id'], webAuth(), awaitHandlerFactory(portalController.bankAccount));
router.post(['/bank-account','/bank-account/:id'], webAuth(), awaitHandlerFactory(portalController.bankAccount_Post));
router.get('/bank-account-list', webAuth(), awaitHandlerFactory(portalController.bankAccountList));
router.get('/bank-account-list-data', webAuth(), awaitHandlerFactory(portalController.bankAccountListData));

router.get(['/cheque-record','/cheque-record/:id'], webAuth(), awaitHandlerFactory(portalController.chequeRecord));
router.post(['/cheque-record','/cheque-record/:id'], webAuth(), awaitHandlerFactory(portalController.chequeRecord_Post));
router.delete(['/cheque-delete/:id'], webAuth(), awaitHandlerFactory(portalController.chequeDelete));
router.get('/cheque-record-list', webAuth(), awaitHandlerFactory(portalController.chequeRecordList));
router.get('/cheque-record-list-data', webAuth(), awaitHandlerFactory(portalController.chequeRecordListData));

router.get('/transaction-list', webAuth(), awaitHandlerFactory(portalController.transactionList));
router.get('/transaction-details/:id', webAuth(), awaitHandlerFactory(portalController.transactionDetails));
router.delete('/transaction-delete/:id', webAuth(), awaitHandlerFactory(portalController.transactionDelete));
router.get('/transaction-list-data', webAuth(), awaitHandlerFactory(portalController.transactionListData));
router.get('/new-transaction', webAuth(), awaitHandlerFactory(portalController.newTransaction));
router.post('/new-transaction', webAuth(), awaitHandlerFactory(portalController.newTransaction_Post));
router.get('/transaction-list', webAuth(), awaitHandlerFactory(portalController.chartOfAccount));

router.get('/income-statement', webAuth(), awaitHandlerFactory(portalController.chartOfAccount));

router.get('/logout', webAuth(), awaitHandlerFactory(portalController.logout));

module.exports = router;