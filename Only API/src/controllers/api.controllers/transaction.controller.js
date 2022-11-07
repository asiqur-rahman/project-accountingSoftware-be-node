const enumm = require('../../utils/enum.utils');
const accountService = require('../../service/account.service');
const transactionService = require('../../service/transaction.service');

module.exports.getById = async(req, res, next) => {
    await transactionService.getById(req.params.id)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.create = async(req, res, next) => {
    await transactionService.create(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.createWithDetails = async(req, res, next) => {
    // return res.send({status:200});
    await transactionService.createWithDetails(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.list = async(req, res, next) => {
    await transactionService.indexData(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.transactionTypeDD = async(req, res, next) => {
    await accountService.transactionTypeDD()
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.allAssetsDD = async(req, res, next) => {
    await accountService.chartOfAccountDDByBaseCode(enumm.AccountHead.Assets.value)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.sslist = async(req, res, next) => {
    await transactionService.ss_indexData(req)
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.lastTransactionsForDashboard = async(req, res, next) => {
    await transactionService.lastTransactionsForDashboard()
    .then(result=>{
        return res.status(200).send(result);
    }).catch(e=>{
        return res.status(e.status).send(e);
    })
};

module.exports.update = async(req, res, next) => {
    
};

module.exports.delete = async(req, res, next) => {
    
};
