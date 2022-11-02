const express = require('express');
const router = express.Router();
const {apiAuth} = require('../../middleware/auth.middleware');

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const accountRouter = require('./account.route');
const transactionRouter = require('./transaction.route');
const reportRouter = require('./report.route');

router.use('/auth', authRouter);
router.use('/user', apiAuth(), userRouter);
router.use('/account',apiAuth(), accountRouter);
router.use('/transaction',apiAuth(), transactionRouter);
router.use('/report',apiAuth(), reportRouter);

// 404 error
router.all('*', (req, res, next) => {
    res.json({
      statusCode:404,
      message:"Endpoint Not Found !",
      url:req.protocol + '://' + req.get('host') + req.originalUrl
  });
});

module.exports = router;