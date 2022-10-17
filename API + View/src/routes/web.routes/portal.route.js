const express = require('express');
const router = express.Router();
const {webAuth} = require('../../middleware/auth.middleware');
const portalController = require('../../controllers/web.controllers/portal.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const {Role} = require('../../utils/enum.utils');
const { loginValidator,userCreateValidator } = require('../../middleware/validators/userValidator.middleware');

router.get('/dashboard', awaitHandlerFactory(portalController.dashboard));
router.get('/accounting-heads', awaitHandlerFactory(portalController.accountingHead));

module.exports = router;