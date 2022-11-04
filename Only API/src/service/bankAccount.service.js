const db = require('../models/model');
const Logger = require('../externalService/log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const sequelize = require('sequelize');
const Op = require('sequelize').Op;

const service = {};

service.create = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.BankAccount.create(req.body).then(async data => {
            resolve({
                status: 201,
                message: 'Account was created, Id:' + data.id
            });
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
        await db.BankAccount.findOne({
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

service.getBankAccountDD =async ()=> {
    return new Promise(async (resolve, reject) => {
        return await db.BankAccount.findAll({
            where: {
                [Op.and]: [{
                    isActive: {
                        [Op.eq]: true
                    }
                }]
            },
            attributes: ['id','name'],
            raw: true
        })
        .then(data => {
            let dd =[];
            data.map(item=>{
                dd.push({label:item.name,value:item.id});
            })
            resolve({status:200,data:dd});
        })
        .catch(function (err) {
            reject({
                status: 502,
                message: err.message
            })
        });
    });
    
};


service.indexData = async (req) => {
    return new Promise(async (resolve, reject) => {
        
        await db.BankAccount.findAndCountAll({
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

        await db.BankAccount.findAndCountAll({
            offset: parseInt(req.query.start),
            limit : parseInt(req.query.length),
            // subQuery:false,
            where: where,
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
        await db.BankAccount.update(req.body, {
            where: {
                id: req.body.id
            }
        }).then(async (result) => {
                if (result) {
                    // await accountBalanceService.updateByCoaId(req).then(() => {
                        resolve({
                            status: 201,
                            message: 'Account was updated !'
                        });
                    // })
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
        await db.BankAccount.destroy({
            where: {
                id: req.params.id
            },
        }).then(() => {
            resolve({
                status: 200,
                message: 'Account deleted successfully.'
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