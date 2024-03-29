const db = require('../models/model')
const Logger = require('../externalService/log.service')
const TransactionService = require('./transaction.service')

const service = {};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.AccountBalance.create(req.body).then((result) => {
            resolve({
                status: 201,
                message: 'Account Balance was created, Id:' + result.id
            });
        })
    })
};

service.updateByCoaId = async (req) => {
    return new Promise(async (resolve, reject) => {
        console.log(req.body)
        let amount = parseInt(req.body.amount)
        if(amount>0){
            await db.AccountBalance.increment({
                amount: req.body.amount
            }, {
                where: {
                    chartOfAccountId: req.body.id
                }
            }).then((result) => {
                resolve({
                    status: 200,
                    message: 'Account Balance updated successfully'
                });
            })
        }
        else{
            await db.AccountBalance.decrement({
                amount: amount*(-1)
            }, {
                where: {
                    chartOfAccountId: req.body.id
                }
            }).then((result) => {
                resolve({
                    status: 200,
                    message: 'Account Balance updated successfully'
                });
            })
        }
        
    })
};

module.exports = service;