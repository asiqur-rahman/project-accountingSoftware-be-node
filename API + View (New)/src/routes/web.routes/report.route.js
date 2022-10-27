const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/web.controllers/report.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

router.get('/income-statement', awaitHandlerFactory(reportController.incomeStatement));
router.post('/income-statement-data', awaitHandlerFactory(reportController.incomeStatementData));
router.get('/balance-sheet', awaitHandlerFactory(reportController.balanceSheet));
router.get('/filter-report', awaitHandlerFactory(reportController.filterReport));
router.post('/filter-report-data', awaitHandlerFactory(reportController.filterReportData));

module.exports = router;