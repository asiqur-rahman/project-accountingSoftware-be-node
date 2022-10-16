const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');

router.use('/auth', authRouter);
router.use('/user', userRouter);

// 404 error
router.all('*', (req, res, next) => {
    res.json({
      statusCode:404,
      message:"Endpoint Not Found !",
      url:req.protocol + '://' + req.get('host') + req.originalUrl
  });
});

module.exports = router;