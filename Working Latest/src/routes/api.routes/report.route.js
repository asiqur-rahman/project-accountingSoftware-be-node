const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/api.controllers/report.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

router.post('/income-statement', awaitHandlerFactory(reportController.incomeStatement));
router.get('/balance-sheet', awaitHandlerFactory(reportController.balanceSheet));
router.post('/custom-report', awaitHandlerFactory(reportController.getCustomReport));

module.exports = router;