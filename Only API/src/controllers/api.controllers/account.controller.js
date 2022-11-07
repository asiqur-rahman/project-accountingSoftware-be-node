const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const accountService = require('../../service/account.service');

module.exports.getById = async(req, res, next) => {
    await accountService.getById(req.params.id)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.create = async(req, res, next) => {
    await accountService.getById(req.body.parentId).then(async data=>{
        req.body.name=`${data.name}:${req.body.name}`;
        req.body.level=data.name.split(':').length;
        req.body.baseCode=req.body.level>1 ? data.baseCode:data.code;
        await accountService.create(req)
        .then(result=>{
            return res.status(200).send(result);
        }).catch(e=>{
            return res.status(e.status).send(e);
        })
    });
};

module.exports.chartOfAccountDD = async (req, res, next) => {
    await accountService.chartOfAccountDD()
    .then(data=>{
        return res.send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.byParentId = async (req, res, next) => {
    await accountService.chartOfAccountDDByParentId(req.params.id)
    .then(data=>{
        return res.send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.byBaseCode = async (req, res, next) => {
    await accountService.chartOfAccountDDByBaseCode(req.params.code)
    .then(data=>{
        return res.status(200).send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.delete = async(req, res, next) => {
    await accountService.delete(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};