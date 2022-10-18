const express = require('express');
const router = express.Router();
const {isLogedIn,webAuth} = require('../../middleware/auth.middleware');

const authRouter = require('./auth.route');
const portalRouter = require('./portal.route');

router.use('/auth', isLogedIn(), authRouter);
router.use('/portal', webAuth(), portalRouter);

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