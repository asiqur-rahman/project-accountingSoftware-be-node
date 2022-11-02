const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/api.controllers/dashboard.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

router.get('/topData', awaitHandlerFactory(dashboardController.topData));
router.get('/last5transaction', awaitHandlerFactory(dashboardController.last5transaction));
router.get('/expenseAccountReview',  awaitHandlerFactory(dashboardController.expenseAccountReview));
router.get('/dashboardApex/:days',  awaitHandlerFactory(dashboardController.dashboardApex));

module.exports = router;