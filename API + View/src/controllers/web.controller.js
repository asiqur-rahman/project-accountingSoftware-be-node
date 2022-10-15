const db = require('../models/model');


module.exports.landing = async (req, res, next) => {
  res.locals = { title: 'Video KYC' };
  res.render('Landing/index',{layout:false});
};

module.exports.customer = async (req, res, next) => {
  res.locals = { title: 'Video KYC Registration' };
  res.render('Customer/index',{layout:false});
};