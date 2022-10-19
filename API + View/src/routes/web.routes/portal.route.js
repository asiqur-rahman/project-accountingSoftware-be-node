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
router.get('/new-chartOfAccount', awaitHandlerFactory(portalController.newchartOfAccount));
router.get('/coaByBaseCode/:code', awaitHandlerFactory(portalController.coaByBaseCode));
router.post('/new-chartOfAccount', awaitHandlerFactory(portalController.newchartOfAccount_Post));
router.get('/new-transaction', awaitHandlerFactory(portalController.newTransaction));
router.post('/new-transaction', awaitHandlerFactory(portalController.newTransaction_Post));
router.get('/transaction-list', awaitHandlerFactory(portalController.chartOfAccount));
router.get('/logout', awaitHandlerFactory(portalController.logout));

module.exports = router;