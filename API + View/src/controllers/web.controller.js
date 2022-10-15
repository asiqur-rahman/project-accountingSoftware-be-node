const db = require('../models/model');
const StatusEnum = require('../utils/enum.utils');
const {appConfig}=require('../config/config');
const Op = require('sequelize').Op;

module.exports.dashboard = async (req, res, next) => {
    res.locals = { title: 'Home' };
    res.render('Landing/index',{layout: false});
};
