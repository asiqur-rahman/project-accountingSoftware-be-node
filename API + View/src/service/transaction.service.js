const db = require('../models/model');
const Logger = require('../externalService/console.log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');

const service = {};

service.getById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.Transaction.findOne({
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
                    message: "Transaction not found !"
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

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.Transaction.create(req.body).then(data => {
            resolve({
                status: 201,
                message: 'Transaction was created, Id:' + data.id
            });
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            });
        });
    });
};

service.createWithDetails = async (req) => {
    return new Promise(async (resolve, reject) => {
        req.body.userId=req.currentUser;
        await db.Transaction.create(req.body,{isNewRecord:true}).then(async data => {
            console.log("data",data)
            const details = [];
            req.body.transactionDetails.forEach(item=>{
                details.push({
                    chartOfAccountId:item.chartOfAccountId,
                    taxId:item.taxId,
                    debit:item.debit,
                    credit:item.credit,
                    transactionId:data.id
                })
            });
            console.log(details);
            await db.TransactionDetails.bulkCreate(details).then(result =>{
                resolve({
                    status: 201,
                    message: 'Transaction was created, Id:' + data.id
                });
            });
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            });
        });
    });
};

module.exports = service;