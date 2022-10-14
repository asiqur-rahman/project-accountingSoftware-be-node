const db = require('../models/model');
const StatusEnum = require('../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const userService = require('../service/user.service');

module.exports.getUserById = async(req, res, next) => {
    await userService.getUserById(req.params.id)
    .then(user=>{
        return res.status(200).send(user);
    }).catch(e=>{
        return res.status(e.status??404).send(e);
    })
};

module.exports.createUser = async(req, res, next) => {
    await userService.createUser(req)
    .then(user=>{
        return res.status(200).send(user);
    }).catch(e=>{
        return res.status(e.status??404).send(e);
    })
};

module.exports.updateUser = async(req, res, next) => {
    
};

module.exports.deleteUser = async(req, res, next) => {
    
};

hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    }
}