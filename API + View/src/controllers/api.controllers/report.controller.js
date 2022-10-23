const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const accountService = require('../../service/account.service');

module.exports.getById = async(req, res, next) => {
    await accountService.getById(req.params.id)
    .then(user=>{
        return res.status(200).send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.create = async(req, res, next) => {
    await accountService.create(req)
    .then(user=>{
        return res.status(200).send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.byParentId = async (req, res, next) => {
    await accountService.chartOfAccountDDByParentId(req.params.id)
    .then(data=>{
        return res.status(200).send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
  }

module.exports.update = async(req, res, next) => {
    
};

module.exports.delete = async(req, res, next) => {
    
};

hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    }
}