const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/web.controllers/report.controller');
const {webAuth} = require('../../middleware/auth.middleware');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

router.get('/income-statement',webAuth(), awaitHandlerFactory(reportController.incomeStatement));
router.post('/income-statement-data',webAuth(), awaitHandlerFactory(reportController.incomeStatementData));
router.get('/balance-sheet',webAuth(), awaitHandlerFactory(reportController.balanceSheet));
router.get('/filter-report', webAuth(),awaitHandlerFactory(reportController.filterReport));
router.post('/filter-report-data',webAuth(), awaitHandlerFactory(reportController.filterReportData));

module.exports = router;