const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');
const chequeController = require('../../controllers/api.controllers/chequeAccount.controller');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');
const { createValidator } = require('../../middleware/validators/chequeValidator.middleware');

router.get('/id/:id',  awaitHandlerFactory(chequeController.getById));
router.post('/', createValidator, awaitHandlerFactory(chequeController.create));
router.patch('/id/:id',  awaitHandlerFactory(chequeController.update));
router.delete('/id/:id',  awaitHandlerFactory(chequeController.delete));
router.get('/list', awaitHandlerFactory(chequeController.list));
router.get('/byParentId/:id', awaitHandlerFactory(chequeController.byParentId));
router.get('/byBaseCode/:code', awaitHandlerFactory(chequeController.byBaseCode));


module.exports = router;