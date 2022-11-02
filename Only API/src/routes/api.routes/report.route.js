const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const reportController = require('../../controllers/api.controllers/report.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/income-statement', awaitHandlerFactory(reportController.incomeStatement));
router.get('/balance-sheet', awaitHandlerFactory(reportController.balanceSheet));

module.exports = router;