const express = require('express');
const router = express.Router();
const {notification} = require('../../middleware/auth.middleware');
const reportController = require('../../controllers/web.controllers/report.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {Role} = require('../../utils/enum.utils');

router.use('/', notification(),(req, res, next) => {
    next()
});

router.get('/income-statement', awaitHandlerFactory(reportController.incomeStatement));
router.post('/income-statement-data', awaitHandlerFactory(reportController.incomeStatementData));
router.get('/balance-sheet', awaitHandlerFactory(reportController.balanceSheet));
router.get('/filter-report', awaitHandlerFactory(reportController.filterReport));
router.post('/filter-report-data', awaitHandlerFactory(reportController.filterReportData));

module.exports = router;