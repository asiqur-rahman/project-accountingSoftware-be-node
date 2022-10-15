const db = require('../models/model');
const Logger = require('../externalService/console.log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const bcrypt = require('bcryptjs');
const {
    resolve
} = require('path');
const Op = require('sequelize').Op;

const service = {};

service.getById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.LiabilityAccount.findOne({
            where: {
                id: id
            },
            // include: [{
            //     model: db.UserDetails,
            //     attributes: ['firstName', 'lastName', 'contactNo', 'email', 'address', 'description'],
            //     include: {
            //         model: db.Role,
            //         as: "role",
            //         attributes: ['code', 'name']
            //     }
            // }],
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                reject({
                    status: 404,
                    message: "Data not found !"
                })
            }
        });
    }).catch(function (err) {
        reject({
            status: 502,
            message: err.message
        });
    });
};

service.getByName = async (value) => {
    return new Promise(async (resolve, reject) => {
        await db.LiabilityAccount.findOne({
            where: {
                [Op.or]: [{
                    name: value
                }]
            },
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                reject({
                    status: 404,
                    message: "Data not found !"
                })
            }
        });
    }).catch(function (err) {
        reject({
            status: 502,
            message: err.message
        });
    });
};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await service.getByName(req.body.name)
        .then(async data => {
            console.log(data)
            if (data) {
                reject({
                    status: 303,
                    message: "Account already exists by this name"
                })
            } 
            else {
                req.body.userId=req.currentUser;
                await db.LiabilityAccount.create(req.body).then(user => {
                    resolve({
                        status: 201,
                        message: 'Account was created, Id:' + user.id
                    });
                }).catch(function (err) {
                    reject({
                        status: 502,
                        message: err.message
                    });
                });
            }
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            });
        });
    });
};

module.exports = service;