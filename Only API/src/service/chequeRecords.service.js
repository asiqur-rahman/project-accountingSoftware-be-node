const db = require('../models/model');
const Logger = require('../externalService/log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');
const accountBalanceService = require('./accountBalance.service');
const accountService = require('./account.service');
const config= require('../../config/config.json')

const service = {};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        req.body.dateTime=Date.now();
        await db.ChequeRecord.create(req.body).then(async data => {
            // await accountBalanceService.updateByCoaId(req).then(() => {
            //     resolve({
            //         status: 201,
            //         message: 'Account was updated !'
            //     });
            // })
            await accountService.getByCodeAndLevel({code:config.appSettings.BankingGlCode,level:config.appSettings.BankingGlLevel}).then(async coa=>{
                await accountBalanceService.updateByCoaId({body:{
                    amount: req.body.amount,
                    userId: req.currentUser,
                    id: coa.id,
                }}).then(() => {
                    resolve({
                        status: 201,
                        message: 'Cheque Record was created, Id:' + data.id
                    });
                })
            })
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            });
        });
    })
};


service.getById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.ChequeRecord.findOne({
            where: {
                id: id
            },
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "Bank Account not found !"
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

service.indexData = async (req) => {
    return new Promise(async (resolve, reject) => {
        
        await db.ChequeRecord.findAndCountAll({
            include: [
                {
                    model: db.BankAccount,
                    attributes: ['name','accountTitle','accountNumber']
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

        await db.ChequeRecord.findAndCountAll({
            offset: parseInt(req.query.start),
            limit : parseInt(req.query.length),
            // subQuery:false,
            where: where,
            include: [
                {
                    model: db.BankAccount,
                    attributes: ['name']
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

service.update = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.ChequeRecord.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(async (result) => {
                if (result) {
                    await accountBalanceService.updateByCoaId(req).then(() => {
                        resolve({
                            status: 201,
                            message: 'Account was updated !'
                        });
                    })
                } else {
                    reject({
                        status: 200,
                        message: 'Account not created'
                    });
                }
            });
        });
};

service.delete = async (req) => {
    return new Promise(async (resolve, reject) => {
        await service.getById(req.params.id).then(async cr=>{
            await db.ChequeRecord.destroy({
                where: {
                    id: req.params.id
                },
            }).then(async () => {
                await accountService.getByCodeAndLevel({code:config.appSettings.BankingGlCode,level:config.appSettings.BankingGlLevel}).then(async coa=>{
                        await accountBalanceService.updateByCoaId({body:{id:coa.id,amount:cr.amount*(-1)}}).then(() => {
                            resolve({
                                status: 200,
                                message: 'Account deleted successfully.'
                            });
                        })
                    }).catch(function (err) {
                        reject({
                            status: 502,
                            message: err.message
                        });
                    });
                });
            });
        });
};

module.exports = service;