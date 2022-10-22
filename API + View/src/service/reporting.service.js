const db = require('../models/model');
const Logger = require('../externalService/console.log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');
const accountBalanceService = require('./accountBalance.service');

const service = {};

service.getIncomeStatement = async () => {
    return new Promise(async (resolve, reject) => {
        await db.Transaction.findAll({
            attributes: ['amount', 'isItIncome'],
            include: [
                {
                model: db.ChartOfAccount,
                attributes: ['name', 'level', 'baseCode'],
                as: 'debitAccount',
                where: {
                    id: {
                        [Op.col]: 'debitAccountId'
                    }
                }
            },
            {
                model: db.ChartOfAccount,
                attributes: ['name', 'level', 'baseCode'],
                as: 'creditAccount',
                where: {
                    id: {
                        [Op.col]: 'creditAccountId'
                    }
                }
            }
        ],
            raw: true
        }).then(data => {
            if (data) {
                var result = [];
                var total = 0;
                //#region Income calculation
                const income = data.filter(x => x.isItIncome === 1);
                var finalIncome=[];
                income.forEach(element => {
                    if(finalIncome.filter(y=>y['creditAccount.baseCode']===element['creditAccount.baseCode']).length>0){
                        finalIncome.forEach(item=>{
                            if(item['creditAccount.baseCode']===element['creditAccount.baseCode']){
                                item.amount+=element.amount;
                            }
                        })
                    }else{
                        finalIncome.push(element);
                    }
                    total += element.amount;
                });
                result.income = {
                    total: total,
                    data: finalIncome
                };
                //#endregion
                
                total = 0;

                //#region Expense calculation
                const expense = data.filter(x => x.isItIncome === 0);
                var finalExpense=[];
                expense.forEach(element => {
                    if(finalExpense.filter(y=>y['debitAccount.baseCode']===element['debitAccount.baseCode']).length>0){
                        finalExpense.forEach(item=>{
                            if(item['debitAccount.baseCode']===element['debitAccount.baseCode']){
                                item.amount+=element.amount;
                            }
                        })
                    }else{
                        finalExpense.push(element);
                    }
                    total += element.amount;
                });
                result.expense = {
                    total: total,
                    data: finalExpense
                }
                //#endregion
                resolve(result);
            } else {
                resolve({
                    status: 404,
                    message: "Transactions not found !"
                })
            }
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            })
        });
    });
};

service.getBalanceSheet = async () => {
    return new Promise(async (resolve, reject) => {
        await db.ChartOfAccount.findAll({
            where: {
                [Op.or]: [{
                    baseCode: {
                        [Op.eq]: enumm.AccountHead.Assets.value
                    }
                }, {
                    baseCode: {
                        [Op.eq]: enumm.AccountHead.Liabilities.value
                    }
                },{
                    baseCode: {
                        [Op.eq]: enumm.AccountHead.Equity.value
                    }
                }]
            },
            // attributes: ['amount', 'isItIncome'],
            // include: [{
            //     model: db.ChartOfAccount,
            //     attributes: ['name', 'level', 'baseCode'],
            //     as: 'debitAccount',
            //     where: {
            //         id: {
            //             [Op.col]: 'debitAccountId'
            //         }
            //     }
            // }],
            // order: [
            //     ['name', 'ASC'],
            // ],
            raw: true
        }).then(data => {
            if (data) {
                console.log(data)
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "Transactions not found !"
                })
            }
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            })
        });
    });
};

module.exports = service;