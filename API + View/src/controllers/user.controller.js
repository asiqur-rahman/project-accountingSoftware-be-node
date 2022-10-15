const db = require('../models/model');
const StatusEnum = require('../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../config/config');
const Op = require('sequelize').Op;
var express = require('express');
var router = express.Router();

module.exports.dashboard = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'Brain Tech Solution | Serving IT to Served you',
        metaDescription:'Brain Tech Solution(BT Solution) is a global information technology firm, BT Solution offers IT solutions, technology consulting and outsourcing services.',
        homepage: 'true' 
    };
    res.render('Dashboard/dashboard');
};

module.exports.contactUs = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'Contact US | Brain Tech Solution',
        metaDescription:'Brain Tech Solution(BT Solution) is a global information technology firm, BT Solution offers IT solutions, technology consulting and outsourcing services.',
    };
    res.render('ContactUS/contactUS');
};

module.exports.aboutUS = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'About US | Brain Tech Solution',
        metaDescription:'Brain Tech Solution(BT Solution) is a global information technology firm, BT Solution offers IT solutions, technology consulting and outsourcing services.',
    };
    res.render('AboutUS/aboutUS');
};

module.exports.privacyPolicy = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'Privacy Policy | Brain Tech Solution',
        metaDescription:'Brain Tech Solution(BT Solution) is a global information technology firm, BT Solution offers IT solutions, technology consulting and outsourcing services.',
    };
    res.render('PrivacyPolicy/privacyPolicy');
};

module.exports.termsAndConditions = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'Terms & Conditions | Brain Tech Solution',
        metaDescription:'Brain Tech Solution(BT Solution) is a global information technology firm, BT Solution offers IT solutions, technology consulting and outsourcing services.',
    };
    res.render('TermsAndConditions/termsAndConditions');
};

module.exports.sitemap = async(req, res, next) => {
    res.render('Sitemap/sitemap',{layout: false});
};

module.exports.notExist = async (req, res, next) => {
    res.redirect('/404');
};

module.exports.notFound = async (req, res, next) => {
    res.locals = { metaTitle: '404 | Page not found' };
    res.render('Error/error');
};