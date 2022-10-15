const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {auth,isLogedIn} = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/auth-login', function (req, res) {
    res.locals = { title: 'Login' };
    res.render('AuthInner/auth-login');
});
router.get('/auth-register', function (req, res) {
    res.locals = { title: 'Register' };
    res.render('AuthInner/auth-register');
});
router.get('/auth-recoverpw', function (req, res) {
    res.locals = { title: 'Recover Password' };
    res.render('AuthInner/auth-recoverpw');
});
router.get('/auth-lock-screen', function (req, res) {
    res.locals = { title: 'Lock Screen' };
    res.render('AuthInner/auth-lock-screen',{layout:false});
});


// Auth Pages

router.get('/pages-maintenance', function (req, res) {
    res.locals = { title: 'Maintenance' };
    res.render('Pages/pages-maintenance');
});
router.get('/pages-comingsoon', function (req, res) {
    res.locals = { title: 'Coming Soon' };
    res.render('Pages/pages-comingsoon');
});
router.get('/pages-404', function (req, res) {
    res.locals = { title: 'Error 404' };
    res.render('Pages/pages-404');
});
router.get('/pages-500', function (req, res) {
    res.locals = { title: 'Error 500' };
    res.render('Pages/pages-500');
});


router.get('/register', function (req, res) {
    if (req.user) { res.redirect('Dashboard/index'); }
    else {
        res.render('Auth/auth-register', { 'message': req.flash('message'), 'error': req.flash('error') ,layout: ''});
    }
});

router.post('/post-register', function (req, res) {
    let tempUser = { username: req.body.username, email: req.body.email, password: req.body.password };
    users.push(tempUser);

    // Assign value in session
    sess = req.session;
    sess.user = tempUser;

    res.redirect('/');
});


router.get('/login',isLogedIn(), awaitHandlerFactory(authController.get_Login));

router.post('/post-login', awaitHandlerFactory(authController.post_Login));

router.get('/logout', awaitHandlerFactory(authController.logout));

router.get('/forgot-password', function (req, res) {
    res.render('Auth/auth-forgot-password', { 'message': req.flash('message'), 'error': req.flash('error') });
});

router.post('/post-forgot-password', function (req, res) {
    const validUser = users.filter(usr => usr.email === req.body.email);
    if (validUser['length'] === 1) {
        req.flash('message', 'We have e-mailed your password reset link!');
        res.redirect('/forgot-password');
    } else {
        req.flash('error', 'Email Not Found !!');
        res.redirect('/forgot-password');
    }
});



module.exports = router;