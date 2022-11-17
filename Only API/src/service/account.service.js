const db = require('../models/model');
const Logger = require('../externalService/log.service');
var path = require('path');
const log = new Logger(path.basename(__filename));
const bcrypt = require('bcryptjs');
const Op = require('sequelize').Op;
const enumm = require('../utils/enum.utils');
const accountBalanceService = require('./accountBalance.service')
const transactionService = require('../service/transaction.service')

const service = {};

service.getTreeWiseData = async () => {
    return new Promise(async (resolve, reject) => {
        await db.ChartOfAccount.findAll({
            where: {
                isActive:true
            },
            include: [{
                model: db.AccountBalance,
                attributes: ['amount'],
                required:false
            }],
            attributes: ['id','name','parentId','baseCode','code','level'],
            raw: true
        })
        .then(data => {
            if (data) {
                const mothers=data.filter(x=>x.parentId === null);
                mothers.forEach(mother => {
                    mother.childs=data.filter(x=>x.parentId === mother.id);
                    mother.childs.forEach(mother => {
                        
                        mothers.forEach(item=>{
                            if(item['code']===mother['baseCode']){
                                item['accountBalances.amount']+=mother['accountBalances.amount'];
                            }
                        })

                        mother.name=mother.name.split(':').pop();
                        mother.childs=data.filter(x=>x.parentId === mother.id);
                        mother.childs.forEach(mother => {
                            mothers.forEach(item=>{
                                if(item['code']===mother['baseCode']){
                                    item['accountBalances.amount']+=mother['accountBalances.amount'];
                                }
                            })
                            mother.name=mother.name.split(':').pop();
                        });
                    });
                });
                // for (const mother of mothers){
                //     mother.childs=data.filter(x=>x.parentId === mother.id);
                // }
                resolve({status:200,data:mothers});
            } else {
                resolve({
                    status: 404,
                    message: "Chart of Account not found !"
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
        await service.getById(req.body.parentId).then(async data=>{
            console.log(req.body,data)
            data=data.data;
            req.body.id=null;
            req.body.userId=req.currentUser;
            req.body.name=`${data.name}:${req.body.name}`;
            req.body.level=data.name.split(':').length;
            req.body.baseCode=req.body.level>1 ? data.baseCode:data.code;
            req.body.code=null;
            await db.ChartOfAccount.create(req.body)
                .then(async (result) => {
                    if (result) {
                        const amount=parseFloat(req.body.amount);
                        const transactionBody={
                            body:{
                                transactionNo:Date.now().toString(),
                                amount:amount,
                                description:"New Chart of Account Entry Transaction",
                                dateTime:Date.now(),
                                userId:req.currentUser,
                                creditAccountId:result.id,
                                transactionDetails:[{
                                    credit:amount,
                                    chartOfAccountId:result.id
                                }]
                            }
                        }
                        await transactionService.createWithDetails(transactionBody)
                        .then(async response => {
                            if(response.status===201){
                                await accountBalanceService.create({body:{
                                    amount: amount,
                                    userId: req.currentUser,
                                    chartOfAccountId: result.id,
                                }}).then(() => {
                                    resolve({
                                        status: 201,
                                        message: 'Account was created, Id:' + result.id
                                    });
                                })
                            }
                        })
                        
                    } else {
                        reject({
                            status: 200,
                            message: 'Account not created'
                        });
                    }
                });
            })
        });
};


service.update = async (req) => {
    return new Promise(async (resolve, reject) => {
        await service.getById(req.body.parentId).then(async data=>{
            data=data.data;
            req.body.name=`${data.name}:${req.body.name}`;
            req.body.level=data.name.split(':').length;
            req.body.baseCode=req.body.level>1 ? data.baseCode:data.code;
            await db.ChartOfAccount.update({
                name: req.body.name,
                parentId: req.body.parentId,
                level: req.body.parentId,
                baseCode: req.body.baseCode
            }, {
                where: {
                    id: req.params.id
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
            })
        });
};

service.chartOfAccountDD =async (withHeaders=true)=> {
    return new Promise(async (resolve, reject) => {
        return await db.ChartOfAccount.findAll({
            where: {
                [Op.and]: [{
                    isActive: {
                        [Op.eq]: true
                    }
                }]
            },
            order: [
                ['name', 'ASC'],
            ],
            attributes: ['id','name','parentId'],
            raw: true
        }).then(data => {
            let dd =[];
            data.map(item=>{
                dd.push({label:item.name,value:item.id});
            })
            resolve({status:200,data:dd});
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            })
        });
    }); 
};


service.currencyDD =async ()=> {
    return new Promise(async (resolve, reject) => {
        return await db.Currency.findAll({
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
            let dd =[];
            data.map(item=>{
                dd.push({label:item.name,value:item.id});
            })
            resolve({status:200,data:dd});
        })
    })
};


service.chartOfAccountDDByParentId =async (parentId)=> {
    return new Promise(async (resolve, reject) => {
        return await db.ChartOfAccount.findAll({
            where: {
                [Op.and]: [{
                    isActive: {
                        [Op.eq]: true
                    },
                    parentId: {
                        [Op.eq]: parentId
                    }
                }]
            },
            attributes: ['name', 'id'],
            raw: true
        }).then(data => {
            let dd =[];
            data.map(item=>{
                dd.push({label:item.name,value:item.id});
            })
            resolve({status:200,data:dd});
        }).catch(function (err) {
            reject({
                status: 502,
                message: err.message
            })
        });
    });
};

service.chartOfAccountDDByBaseCode =async (code)=> {
    return new Promise(async (resolve, reject) => {
        return await db.ChartOfAccount.findAll({
            where: {
                [Op.and]: [{
                    isActive: {
                        [Op.eq]: true
                    },
                    baseCode: {
                        [Op.eq]: code
                    },
                    code: {
                        [Op.eq]: null
                    }
                }]
            },
            attributes: ['name', 'id'],
            raw: true
        }).then(data => {
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

service.transactionTypeWithRef = async ()=> {
    return await db.ChartOfAccount.findAll({
        include: { model: db.ChartOfAccount,attributes: ['name', 'id'] },
        attributes: ['name', 'id'],
        raw: true
    }).then(data => {
        return data;
    });
};

service.getById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.ChartOfAccount.findOne({
            where: {
                id: id
            },
            include: [{
                model: db.AccountBalance,
                attributes: ['amount'],
                required:false
            }],
            raw: true
        }).then(data => {
            if (data) {
                resolve({status:200,data:data});
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

service.transactionTypeDD = async ()=> {
    return new Promise(async (resolve, reject) => {
        await db.ChartOfAccount.findAll({
            where: {
                [Op.or]: [{
                    code: {
                        [Op.eq]: enumm.AccountHead.Expense.value
                    }
                }, {
                    code: {
                        [Op.eq]: enumm.AccountHead.Income.value
                    }
                }]
            },
            attributes: ['name', 'code'],
            raw: true
        }).then(data => {
            let dd =[];
            data.map(item=>{
                dd.push({label:item.name,value:item.code});
            })
            resolve({status:200,data:dd});
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

service.transactionTypeWithRef = async ()=> {
    return await db.ChartOfAccount.findAll({
        include: { model: db.ChartOfAccount,attributes: ['name', 'id'] },
        attributes: ['name', 'id'],
        raw: true
    }).then(data => {
        return data;
    });
};

service.getBaseCodeById = async (id) => {
    return new Promise(async (resolve, reject) => {
        await db.ChartOfAccount.findOne({
            where: {
                id: id
            },
            attributes: ['baseCode'],
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "Data not found !"
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
        await db.ChartOfAccount.findOne({
            where: {
                [Op.or]: [{
                    name: value
                }]
            },
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "COA not found !"
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


service.getByCode = async (value) => {
    return new Promise(async (resolve, reject) => {
        await db.ChartOfAccount.findOne({
            where: {
                [Op.or]: [{
                    code: value
                }]
            },
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "COA not found !"
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

service.getByCodeAndLevel = async (value) => {
    return new Promise(async (resolve, reject) => {
        await db.ChartOfAccount.findOne({
            where: {
                [Op.and]: [{
                    baseCode: {
                        [Op.eq]: value.code
                    }
                }, {
                    level: {
                        [Op.eq]: value.level
                    }
                }]
            },
            raw: true
        }).then(data => {
            if (data) {
                resolve(data);
            } else {
                resolve({
                    status: 404,
                    message: "COA not found !"
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

service.delete = async (req) => {
    return new Promise(async (resolve, reject) => {
        await db.ChartOfAccount.destroy({
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

// service.create = async (req) => {
//     return new Promise(async (resolve, reject) => {
//         await service.getByName(req.body.name)
//         .then(async data => {
//             if (data && data.status != 404) {
//                 reject({
//                     status: 303,
//                     message: "Account already exists by this name"
//                 })
//             } 
//             else {
//                 req.body.userId=req.currentUser;
//                 await db.ChartOfAccount.create(req.body).then(user => {
//                     resolve({
//                         status: 201,
//                         message: 'Account was created, Id:' + user.id
//                     });
//                 }).catch(function (err) {
//                     reject({
//                         status: 502,
//                         message: err.message
//                     });
//                 });
//             }
//         }).catch(function (err) {
//             reject({
//                 status: 502,
//                 message: err.message
//             });
//         });
//     });
// };

module.exports = service;