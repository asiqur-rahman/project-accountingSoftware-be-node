const express = require('express');
const router = express.Router();
const webController = require('../controllers/web.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', awaitHandlerFactory(webController.dashboard));

module.exports = router;