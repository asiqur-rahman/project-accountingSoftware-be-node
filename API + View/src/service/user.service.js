const db = require('../models/model');
const Logger = require('../externalService/console.log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');

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
        await db.User.scope('loginPurpose').findOne({
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


service.indexData = async (req) => {
    return new Promise(async (resolve, reject) => {
        //-----------------Server side pagination----------------------
        const order = req.query.columns[req.query.order[0].column].data=='sl'?[]:sequelize.literal(req.query.columns[req.query.order[0].column].data+" "+req.query.order[0].dir);//req.query.order[0].column=='0'?[]:[[req.query.columns[req.query.order[0].column].data,req.query.order[0].dir]];
        var searchQuery=[];
        req.query?.columns?.forEach(coloum => {
            if(coloum.data!='sl' && coloum.data!='id')searchQuery.push(sequelize.col(coloum.data));
        });
        var where = {};
        if(req.query.search.value!=''){
            where = {
                [Op.and]: [
                    sequelize.where(sequelize.fn("concat",...searchQuery), "like", '%'+req.query.search.value+'%' )
                    , {
                    // roleId: {
                    //     [Op.ne]: roleId
                    // }
                }]
            }
        }else{
            where = {
                [Op.and]: [ {
                    // roleId: {
                    //     [Op.ne]: roleId
                    // }
                }]
            }
        }
        //-----------------Server side pagination----------------------

        await db.User.findAndCountAll({
            offset: parseInt(req.query.start),
            limit : parseInt(req.query.length),
            // subQuery:false,
            where: where,
            include: [
                {
                    model: db.UserDetails,
                    attributes: ['firstName', 'lastName'],
                    include: [
                        {
                            model: db.Role,
                            attributes: ['name'],
                        }
                    ],
                }
            ],
            order: order,
            raw: true
        }).then(detailsInfo => {
            console.log(detailsInfo)
            if (detailsInfo.rows) {
                var count = req.query.start;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                })
                // console.log(detailsInfo);
                resolve({draw:req.query.draw,recordsTotal:detailsInfo.count,recordsFiltered:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0,rows:[]});
            }
        });
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