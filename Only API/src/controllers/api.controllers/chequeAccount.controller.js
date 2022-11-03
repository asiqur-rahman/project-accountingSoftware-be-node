const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const chequeService = require('../../service/chequeRecords.service');

module.exports.getById = async(req, res, next) => {
    await chequeService.getById(req.params.id)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.create = async(req, res, next) => {
    await chequeService.getById(req.body.parentId).then(async data=>{
        req.body.name=`${data.name}:${req.body.name}`;
        req.body.level=data.name.split(':').length;
        req.body.baseCode=req.body.level>1 ? data.baseCode:data.code;
        await chequeService.create(req)
        .then(result=>{
            return res.status(200).send(result);
        }).catch(e=>{
            return res.status(e.status).send(e);
        })
    });
};

module.exports.byParentId = async (req, res, next) => {
    await chequeService.chartOfAccountDDByParentId(req.params.id)
    .then(data=>{
        return res.status(200).send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.byBaseCode = async (req, res, next) => {
    await chequeService.chartOfAccountDDByBaseCode(req.params.code)
    .then(data=>{
        return res.status(200).send(data);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.list = async(req, res, next) => {
    await chequeService.indexData(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.sslist = async(req, res, next) => {
    await chequeService.ss_indexData(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.delete = async(req, res, next) => {
    await chequeService.delete(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};