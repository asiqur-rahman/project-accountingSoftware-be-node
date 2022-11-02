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

const service = {};

service.getIncomeStatement = async (req) => {
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
            where: {
                dateTime: {
                    [Op.between]: [moment(req.body.fromDate).format("MM/DD/yyyy"),moment(req.body.toDate).add(1,'d').format("MM/DD/yyyy")]
                }
            },
            raw: true
        }).then(data => {
            if (data) {
                var result = [];
                var total = 0;
                //#region Income calculation
                const income = data.filter(x => x.isItIncome === 1);
                var finalIncome=[];
                income.forEach(element => {
                    if(finalIncome.filter(y=>y['creditAccount.baseCode']===element['creditAccount.baseCode'] && y['creditAccount.name']===element['creditAccount.name']).length>0){
                        finalIncome.forEach(item=>{
                            if(item['creditAccount.baseCode']===element['creditAccount.baseCode'] && item['creditAccount.name']===element['creditAccount.name']){
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
                    if(finalExpense.filter(y=>y['debitAccount.baseCode']===element['debitAccount.baseCode'] && y['debitAccount.name']===element['debitAccount.name']).length>0){
                        finalExpense.forEach(item=>{
                            if(item['debitAccount.baseCode']===element['debitAccount.baseCode'] && item['debitAccount.name']===element['debitAccount.name']){
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
            attributes: ['name','code','baseCode','level'],
            include: [{
                model: db.AccountBalance,
                attributes: ['amount'],
                where: {
                    chartOfAccountId: {
                        [Op.col]: 'chartOfAccount.id'
                    }
                }
            }],
            // order: [
            //     ['name', 'ASC'],
            // ],
            raw: true
        }).then(data => {
            if (data) {
                var result = [];
                var total = 0;
                //#region Assets calculation
                const assets = data.filter(x => x.baseCode === enumm.AccountHead.Assets.value.toString());
                var finalAssets=[];
                assets.forEach(element => {
                    if(finalAssets.filter(y=>y['baseCode']===element['baseCode'] && y['name']===element['name']).length>0){
                        finalAssets.forEach(item=>{
                            if(item['baseCode']===element['baseCode'] && item['name']===element['name']){
                                item['accountBalances.amount']+=element['accountBalances.amount'];
                            }
                        })
                    }else{
                        finalAssets.push(element);
                    }
                    total += element['accountBalances.amount'];
                });
                result.assets = {
                    total: total,
                    data: finalAssets
                };
                //#endregion
                total=0;
                //#region Assets calculation
                const liabilities = data.filter(x => x.baseCode === enumm.AccountHead.Liabilities.value.toString());
                var finalLiabilities=[];
                liabilities.forEach(element => {
                    if(finalLiabilities.filter(y=>y['baseCode']===element['baseCode']).length>0){
                        finalLiabilities.forEach(item=>{
                            if(item['baseCode']===element['baseCode']){
                                item['accountBalances.amount']+=element['accountBalances.amount'];
                            }
                        })
                    }else{
                        finalLiabilities.push(element);
                    }
                    total += element['accountBalances.amount'];
                });
                result.liabilities = {
                    total: total,
                    data: finalLiabilities
                };
                //#endregion
                total=0;
                //#region Assets calculation
                const equities = data.filter(x => x.baseCode === enumm.AccountHead.Liabilities.value.toString());
                var finalEquities=[];
                equities.forEach(element => {
                    if(finalEquities.filter(y=>y['baseCode']===element['baseCode']).length>0){
                        finalEquities.forEach(item=>{
                            if(item['baseCode']===element['baseCode']){
                                item['accountBalances.amount']+=element['accountBalances.amount'];
                            }
                        })
                    }else{
                        finalEquities.push(element);
                    }
                    total += element['accountBalances.amount'];
                });
                result.equities = {
                    total: total,
                    data: finalEquities
                };
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


service.getFilterRecordData = async (req) => {
    return new Promise(async (resolve, reject) => {
        var formDate=moment().format("yyyy-MM-DD");
        var toDate=moment().format("yyyy-MM-DD");
        if(req.body.fromDate){
            var splitdate=req.body.fromDate.split('/');
            formDate=`${splitdate[2]}-${splitdate[0]}-${splitdate[1]}`
        }
        if(req.body.toDate){
            var splitdate=req.body.toDate.split('/');
            toDate=`${splitdate[2]}-${splitdate[0]}-${splitdate[1]}`
        }
    await db.sequelize.query('CALL SP_FilterRecord (:fromDate,:toDate,:charAccountId)', {
        replacements: {
            fromDate: formDate,
            toDate: toDate,
            charAccountId: req.body.charAccountId?req.body.charAccountId.toString():'0'
        }
    }).then(data => {
        resolve(data);
    }).catch(function (err) {
        reject({
            status: 502,
            message: err.message
        })
    });
});
};

module.exports = service;