const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const bankAccountService = require('../../service/bankAccount.service');

module.exports.getById = async(req, res, next) => {
    await bankAccountService.getById(req.params.id)
    .then(result=>{
        return res.send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.create = async(req, res, next) => {
    await bankAccountService.create(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    });
};

module.exports.update = async(req, res, next) => {
    await bankAccountService.update(req)
    .then(result=>{
        return res.send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.dropdown = async(req, res, next) => {
    await bankAccountService.getBankAccountDD(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    });
};

module.exports.byParentId = async (req, res, next) => {
    await bankAccountService.chartOfAccountDDByParentId(req.params.id)
    .then(data=>{
        return res.status(200).send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.byBaseCode = async (req, res, next) => {
    await bankAccountService.chartOfAccountDDByBaseCode(req.params.code)
    .then(data=>{
        return res.status(200).send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.list = async(req, res, next) => {
    await bankAccountService.indexData(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.sslist = async(req, res, next) => {
    await bankAccountService.ss_indexData(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.delete = async(req, res, next) => {
    await bankAccountService.delete(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};