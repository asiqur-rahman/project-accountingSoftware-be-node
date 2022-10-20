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
            console.log("allOK")
            resolve({
                status: 200,
                message: 'Transaction deleted successfully.'
            });
        }).catch(function (err) {
            console.log("notOK")
            reject({
                status: 502,
                message: err.message
            });
        });
    });
};


service.indexData = async (req) => {
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
                    detail.dateTime= moment.utc(detail.dateTime).format("DD-MM-yyyy hh:mm:ss A");
                })
                // console.log(detailsInfo);
                resolve({draw:req.query.draw,recordsTotal:detailsInfo.count,recordsFiltered:detailsInfo.count,data:detailsInfo.rows});
            } else {
                resolve({count: 0,rows:[]});
            }
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