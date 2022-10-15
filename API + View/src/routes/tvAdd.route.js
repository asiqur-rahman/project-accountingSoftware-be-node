const express = require('express');
const router = express.Router();
const tvAddController = require('../controllers/tvAdd.controller');
const {auth,isLogedIn} = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/tvAdsIndex', awaitHandlerFactory(tvAddController.adsIndex));
router.get('/tvAdsShow/:adsName', awaitHandlerFactory(tvAddController.adsShow));

module.exports = router;