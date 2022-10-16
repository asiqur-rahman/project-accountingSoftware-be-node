const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const {getSessionDetails} = require('../../middleware/auth.middleware');

router.use('/auth', getSessionDetails(), authRouter);

// Route all to login page
router.get('/', (req, res, next) => {
  res.redirect('/auth/login');
});

// 404 error
router.all('*', (req, res, next) => {
  res.render('Pages/pages-404', {
    layout: false
  });
});

module.exports = router;