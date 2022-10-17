const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const accountController = require('../../controllers/api.controllers/account.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { accountCreateValidator } = require('../../middleware/validators/accountingHeadValidator.middleware');

router.get('/:id', apiAuth(), awaitHandlerFactory(accountController.getById));
router.post('/', apiAuth(),accountCreateValidator, awaitHandlerFactory(accountController.create));
router.patch('/:id', apiAuth(), awaitHandlerFactory(accountController.update));
router.delete('/:id', apiAuth(), awaitHandlerFactory(accountController.delete));

module.exports = router;