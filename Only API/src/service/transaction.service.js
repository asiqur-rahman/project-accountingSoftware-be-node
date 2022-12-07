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

service.delete = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.Transaction.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            resolve({
                status: 200,
                message: 'Transaction deleted successfully.'
            });
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            });
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

        await db.Transaction.findAndCountAll({
            offset: parseInt(req.query.start),
            limit : parseInt(req.query.length),
            // subQuery:false,
            where: where,
            include: [
                {
                model: db.ChartOfAccount,
                attributes: ['name'],
                as: 'creditAccount',
                where: { id: {[Op.col]: 'creditAccountId'} }
                },
                {
                model: db.ChartOfAccount,
                attributes: ['name'],
                as: 'debitAccount',
                where: { id: {[Op.col]: 'debitAccountId'} }
                }
            ],
            order: order,
            raw: true
        }).then(detailsInfo => {
            if (detailsInfo.rows) {
                var count = req.query.start;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                    detail.dateTime= moment.utc(detail.dateTime).format("DD-MM-yyyy");
                })
                resolve({draw:req.query.draw,recordsTotal:detailsInfo.count,recordsFiltered:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0,rows:[]});
            }
        });
    });
};


service.indexData = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.Transaction.findAndCountAll({
            attributes: ['id','amount','datetime','description','transactionNo'],
            order:[['id', 'DESC']],
            raw: true
        }).then(detailsInfo => {
            if (detailsInfo.rows) {
                var count = 0;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                    detail.datetime= moment.utc(detail.datetime).format("DD-MM-yyyy");
                })
                resolve({status:200,recordsTotal:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0,rows:[]});
            }
        });
    });
};

service.lastTransactionsForDashboard = async (req) => {
    return new Promise(async (resolve, reject) => {
        
        await db.Transaction.findAndCountAll({
            offset: 0,
            limit : 7,
            // subQuery:false,
            include: [
                {
                model: db.ChartOfAccount,
                attributes: ['name'],
                as: 'creditAccount',
                where: { id: {[Op.col]: 'creditAccountId'} }
                },
                {
                model: db.ChartOfAccount,
                attributes: ['name'],
                as: 'debitAccount',
                where: { id: {[Op.col]: 'debitAccountId'} }
                }
            ],
            order:[['id', 'DESC']],
            raw: true
        }).then(detailsInfo => {
            if (detailsInfo.rows) {
                var count = 0;
                detailsInfo.rows.forEach(detail => {
                    detail.sl = ++count;
                    detail.dateTime= moment.utc(detail.dateTime).format("DD-MM-yyyy");
                })
                // resolve(detailsInfo);
                resolve({draw:'1',recordsTotal:detailsInfo.count,recordsFiltered:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0, rows: []});
            }
        });
    });
};


service.dashboardEAR = async (req) => {
    return new Promise(async (resolve, reject) => {
        
        await db.ChartOfAccount.findAll({
            where: {
                [Op.or]: [{
                    baseCode: {
                        [Op.eq]: enumm.AccountHead.Expense.value
                    }
                }]
            },
            attributes: ['name'],
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
        }).then(detailsInfo => {
            if (detailsInfo) {
                var key=[];
                var value=[];
                detailsInfo.forEach(element => {
                    key.push(element.name);
                    value.push(element['accountBalances.amount']);
                });
                resolve({key:key, value:value});
            } else {
                resolve({count: 0, rows: []});
            }
        });
    });
};

service.createWithDetails = async (req) => {
    return new Promise(async (resolve, reject) => {
        const {transactionDetails,...transaction} = req.body;
        // console.log(transaction);
        // console.log(transactionDetails);
        await db.Transaction.create(transaction,{isNewRecord:true}).then(async data => {
            const details = [];
            // // if(transaction.isItIncome){
            //     accountBalanceService.updateByCoaId({body:{amount:transaction.amount,id:transaction.creditAccountId}});
            //     accountBalanceService.updateByCoaId({body:{amount:transaction.amount*(-1),id:transaction.debitAccountId}});
            // // }else{
            // //     accountBalanceService.updateByCoaId({amount:transaction.amount*-1,chartOfAccountId:transaction.creditAccountId});
            // //     accountBalanceService.updateByCoaId({amount:transaction.amount,chartOfAccountId:transaction.debitAccountId});
            // // }
            transactionDetails.forEach(item=>{
                details.push({
                    chartOfAccountId:item.chartOfAccountId,
                    debit:item.debit,
                    credit:item.credit,
                    transactionId:data.id
                })
            });
            await db.TransactionDetails.bulkCreate(details).then(result =>{
                details.forEach(async element => {
                    await db.AccountBalance.increment({amount:element.debit?element.debit:element.credit*-1},{where:{chartOfAccountId:element.chartOfAccountId}});
                });
                resolve({
                    status: 201,
                    message: 'Transaction was created, Id:' + data.id
                });
            });
        }).catch(function (err) {
            console.log(err.message)
            reject({
                status: 0,
                message: err.message
            });
        });
    });
};


service.transactionDetailsByTransactionId = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.TransactionDetails.findAndCountAll({
            where: {
                transactionId: req.params.id
            },
            attributes: ['credit','debit'],
            include: [
                {
                    model: db.ChartOfAccount,
                    attributes: ['name']
                },
                {
                    model: db.Transaction,
                    attributes: ['dateTime']
                }
            ],
            raw: true
        }).then(data => {
            if (data.rows) {
                var count=0;
                data.rows.forEach(detail => {
                    detail.sl = ++count;
                    detail.dateTime=moment.utc(detail.dateTime).format("DD-MM-yyyy");
                })
                resolve({status:200,data:data.rows});
            } else {
                resolve([]);
            }
            resolve(data);
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            });
        });
    });
};

module.exports = service;