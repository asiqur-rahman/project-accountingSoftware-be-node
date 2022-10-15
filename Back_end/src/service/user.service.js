const db = require('../models/model');
const bcrypt = require('bcryptjs');
const Logger = require('../externalService/console.log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const Op = require('sequelize').Op;

const service = {};

// service.getUserById = (req, res, next) => {
//     return next();
// };

service.getById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.User.findOne({
            where: {
                id: id
            },
            include: [{
                model: db.UserDetails,
                attributes: ['firstName', 'lastName', 'contactNo', 'email', 'address', 'description'],
                include: {
                    model: db.Role,
                    as: "role",
                    attributes: ['code', 'name']
                }
            }],
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "User not found !"
                })
            }
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            })
        });
    }).catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

service.getByName = async (value) => {
    return new Promise(async (resolve, reject) => {
        await db.User.findOne({
            where: {
                [Op.or]: [{
                    username: value
                }]
            },
            include: [{
                model: db.UserDetails,
                attributes: ['firstName', 'lastName', 'contactNo', 'email', 'address', 'description'],
                include: {
                    model: db.Role,
                    as: "role",
                    attributes: ['code', 'name']
                }
            }],
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "User not found !"
                })
            }
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            })
        });
    })
    .catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await service.getByName(req.body.username)
        .then(async data => {
            if (data && data.status != 404) {
                resolve({
                    status: 303,
                    message: "User already exists by this username"
                })
            } else {
                var customerData = {};
                req.body.password = await bcrypt.hash(req.body.password, 8);
                await db.UserDetails.create(req.body)
                    .then(customer => {
                        customerData = customer;
                    })
                    .catch(function (err) {
                        reject({
                            status: 502,
                            message: err.message
                        });
                    });
                req.body.userDetailId = customerData.id;
                await db.User.create(req.body).then(user => {
                    resolve({
                        status: 201,
                        message: 'User was created, Id:' + user.id
                    });
                }).catch(function (err) {
                    reject({
                        status: 502,
                        message: err.message
                    });
                });
            }
        });
    }).catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

module.exports = service;