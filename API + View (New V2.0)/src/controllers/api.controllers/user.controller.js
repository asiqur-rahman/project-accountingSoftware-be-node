const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const userService = require('../../service/user.service');

module.exports.getById = async(req, res, next) => {
    await userService.getById(req.params.id)
    .then(user=>{
        return res.status(200).send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.create = async(req, res, next) => {
    await userService.create(req)
    .then(user=>{
        return res.status(200).send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.update = async(req, res, next) => {
    
};

module.exports.delete = async(req, res, next) => {
    
};

hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    }
}