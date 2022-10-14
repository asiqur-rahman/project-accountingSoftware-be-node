const db = require('../models/model');
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
                    message: "User not found !"
                })
            }
        });
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
        }).then(user => {
            if (user) {
                resolve(user);
            } else {
                reject({
                    status: 404,
                    message: "User not found !"
                })
            }
        });
    });
};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await service.getUserByName(req.body.username)
        .then(async data => {
            if (data) {
                reject({
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
    });
};

module.exports = service;