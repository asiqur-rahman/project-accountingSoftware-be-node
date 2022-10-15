const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth.middleware');
const accountController = require('../controllers/account.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const { accountCreateValidator } = require('../middleware/validators/accountingHeadValidator.middleware');

router.get('/:id', auth(), awaitHandlerFactory(accountController.getById));
router.post('/', auth(),accountCreateValidator, awaitHandlerFactory(accountController.create));
router.patch('/:id', auth(), awaitHandlerFactory(accountController.update));
router.delete('/:id', auth(), awaitHandlerFactory(accountController.delete));

module.exports = router;