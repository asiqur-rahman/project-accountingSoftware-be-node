const db = require('../../models/model');
const StatusEnum = require('../../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;
const userService = require('../../service/user.service');

module.exports.getById = async(req, res, next) => {
    await userService.getById(req.params.id)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.create = async(req, res, next) => {
    await userService.create(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.update = async(req, res, next) => {
    await userService.update(req)
    .then(user=>{
        return res.send(user);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.delete = async(req, res, next) => {
    
};

module.exports.passwordReset = async (req, res, next) => {
    await userService.resetPassword(req).then(data => {
        return res.send(data);
    });
  }

module.exports.roleDropdown = async(req, res, next) => {
    await userService.getRoleDD()
    .then(result=>{
        return res.send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    });
};

module.exports.changeStatus = async (req, res, next) => {
    await userService.changeStatus(req).then(data => {
      res.status(200).send(data);
    });
}

module.exports.list = async(req, res, next) => {
    await userService.indexData(req)
    .then(result=>{
        return res.send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

hashPassword = async (req) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
    }
}