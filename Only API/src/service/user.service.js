const db = require('../models/model');
const Logger = require('../externalService/log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');
const emailService = require('../externalService/email.service');

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


service.changeStatus = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.User.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        }).then(async userInfo => {
            if (userInfo) {
                await db.User.update({
                        isActive: userInfo.isActive==1?0:1,
                    }, {
                        where: {
                            id: userInfo.id
                        }
                    })
                    .then(async () => {
                        resolve({
                            status: 200,
                            message: "User status updated successfully"
                        })
                    });
            } else {
                resolve({
                    status: 404,
                    message: "User not found !"
                })
            }
    
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
        await db.User.findAndCountAll({
            include: [
                {
                    model: db.UserDetails,
                    attributes: ['firstName', 'lastName','email'],
                    include: [
                        {
                            model: db.Role,
                            attributes: ['name'],
                        }
                    ],
                }
            ],
            raw: true
        }).then(detailsInfo => {
            if (detailsInfo.rows) {
                var count = 0;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                })
                resolve({status:200,recordsTotal:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0,rows:[]});
            }
        });
    });
};

service.ss_indexData = async (req) => {
    return new Promise(async (resolve, reject) => {
        //-----------------Server side pagination----------------------
        const order = req.query.columns[req.query.order[0].column].data=='sl'?[]:sequelize.literal(req.query.columns[req.query.order[0].column].data+" "+req.query.order[0].dir);//req.query.order[0].column=='0'?[]:[[req.query.columns[req.query.order[0].column].data,req.query.order[0].dir]];
        var searchQuery=[];
        req.query.columns.forEach(coloum => {
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
                    attributes: ['firstName', 'lastName','email'],
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
            if (detailsInfo.rows) {
                var count = req.query.start;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                })
                resolve({draw:req.query.draw,recordsTotal:detailsInfo.count,recordsFiltered:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0,rows:[]});
            }
        });
    });
};


service.getRoleDD =async ()=> {
    return await db.Role.findAll({
        where: {
            [Op.and]: [{
                isActive: {
                    [Op.eq]: true
                }
            }]
        },
        attributes: ['id','name'],
        raw: true
    }).then(data => {
        return data;
    })
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
                const password=(Date.now() % 100000000).toString();
                req.body.password = await bcrypt.hash(password, 8);
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
                req.body.isActive = true;
                await db.User.create(req.body).then(async user => {
                    await emailService.sendMail({
                        To: [req.body.email],
                        MailSubject: "Accounting Pro User Portal Credentials.",
                        MailBody: `Hi ${req.body.firstName}, <br/><br/>Welcome to Accounting Pro. Here is your portal login credentials.<br/><br/>UserName : <b>${req.body.username}</b><br/>Password : <b>${password}</b><br/><br/> Thank you for joining Accounting Pro.<br/><br/>This is auto generated mail.<br/>Please don't reply.<br/>`
                    },req);
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


service.resetPassword = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.User.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: db.UserDetails,
                attributes: ['email']
            },
            raw: true
        }).then(async userInfo => {
            if (userInfo) {
                const passwordNotHashed = (Date.now() % 10000000000).toString();
                await bcrypt.hash(passwordNotHashed, 8).then(async password => {
                    await db.User.update({
                            password: password,
                            forceChangePassword: 1
                        }, {
                            where: {
                                id: userInfo.id
                            }
                        })
                        .then(async () => {
                            await emailService.sendMail({
                                To: [userInfo['userDetail.email']],
                                MailSubject: "Accounting Pro Reset User Portal Credentials.",
                                MailBody: `Hi ${userInfo.username.toUpperCase()}, <br/><br/>Welcome to Accounting Pro. Here is your new portal login credentials.<br/><br/>UserName : <b>${userInfo.username}</b><br/>Password : <b>${passwordNotHashed}</b><br/><br/> Thank you for joining Accounting Pro.<br/><br/>This is auto generated mail.<br/>Please don't reply.<br/>`
                            }, req).then((result) => {
                                // res.status(200).send({status:true,result:result});
                                if(result.status==200){
                                    resolve({
                                        status: 200,
                                        message: 'Password reseted successfully!'
                                    });
                                }else{
                                    reject({
                                        status: 502,
                                        message: "Email sending failed !"
                                    });
                                }
                            });
                        });
                });
            } else {
                reject({
                    status: 502,
                    message: "User not found!"
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

service.update = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.UserDetails.update(req.body, {
            where: {
                id: req.body.userDetailId
            }
        }).then(async () => {
            await db.User.update(req.body, {
                where: {
                    id: req.body.id
                }
            }).then(() => {
                resolve({
                    status: 201,
                    message: 'User was updated.'
                });
            });
        }).catch(function (err) {
            reject({
                status: 200,
                message: 'User was not updated.'
            });
        });
    }).catch(function (err) {
        log.debug('Error', {
            error: err.message,
        });
        throw err;
    });
};

module.exports = service;